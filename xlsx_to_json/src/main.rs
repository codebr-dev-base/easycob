use calamine::{DataType, Reader, Xlsx, open_workbook};
use chrono::{Duration, NaiveDate};
use regex::Regex;
use serde::Serialize;
use serde_json::Value;
use std::collections::{HashMap, HashSet};
use std::error::Error;
use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};
use unidecode::unidecode; // Biblioteca para remover acentos

#[derive(Serialize)]
struct Row {
    #[serde(flatten)]
    data: std::collections::HashMap<String, String>,
}

fn get_executable_directory() -> Result<PathBuf, Box<dyn Error>> {
    let exe_path = std::env::current_exe()?;
    let exe_dir = exe_path
        .parent()
        .ok_or("Não foi possível determinar a pasta do executável")?
        .to_path_buf();

    Ok(exe_dir)
}

// Função para normalizar o nome da planilha
fn normalize_sheet_name(sheet_name: &str) -> String {
    // Remove acentos e caracteres especiais
    let normalized = unidecode(sheet_name);
    // Substitui espaços por _
    let normalized = normalized.replace(" ", "_");
    // Converte para minúsculas
    normalized.to_lowercase()
}

fn load_date_columns() -> Result<HashSet<String>, Box<dyn Error>> {
    let exe_dir = get_executable_directory()?; // Obtém a pasta do binário
    let file_path = exe_dir.join("col_date.json"); // Caminho correto do JSON

    // Verifica o diretório atual para depuração
    let current_dir = std::env::current_dir()?;
    println!(
        "Procurando o arquivo em: {:?}",
        current_dir.join(&file_path)
    );

    // Tenta ler o arquivo
    // Lê o arquivo
    let data = fs::read_to_string(&file_path)
        .map_err(|e| format!("Erro ao abrir {}: {}", file_path.display(), e))?;

    // Tenta converter o JSON
    let json: Value =
        serde_json::from_str(&data).map_err(|e| format!("Erro ao parsear JSON: {}", e))?;

    // Extraindo os nomes das colunas
    let columns = json["date_columns"]
        .as_array()
        .ok_or("Formato inválido no JSON: esperado um array em 'date_columns'")?
        .iter()
        .filter_map(|v| v.as_str().map(String::from))
        .collect();

    Ok(columns)
}

// Função para mapear nomes de colunas
fn process_cell(value: &DataType, column_name: &str, date_columns: &HashSet<String>) -> String {
    if date_columns.contains(column_name) {
        let base_date = NaiveDate::from_ymd_opt(1900, 1, 1).unwrap_or_else(|| {
            eprintln!("Erro: Data base inválida.");
            NaiveDate::default() // Retorna uma data padrão se a data base for inválida.
        });

        // Tenta converter `value` para um número (float ou int)
        let days = match value {
            DataType::Float(n) => {
                *n as i64 - 2 // Converte float para dias
            }
            DataType::Int(n) => {
                *n - 2 // Converte int para dias
            }
            DataType::String(s) => {
                // Tenta converter a string para um número
                if let Ok(n) = s.parse::<f64>() {
                    n as i64 - 2
                } else if let Ok(n) = s.parse::<i64>() {
                    n - 2
                } else {
                    // Se não for possível converter, retorna o valor original
                    eprintln!("Erro: Valor '{}' não é um número válido.", s);
                    return value.to_string();
                }
            }
            DataType::DateTime(n) => {
                *n as i64 - 2 // Converte DateTime para dias
            }
            _ => {
                // Para outros tipos, retorna o valor original
                eprintln!(
                    "Erro: Valor não é um número ou string: {:?} na coluna {}.",
                    value, column_name
                );
                return value.to_string();
            }
        };

        // Tenta calcular a data
        if let Some(date) = base_date.checked_add_signed(Duration::days(days)) {
            return date.format("%Y-%m-%d").to_string();
        } else {
            eprintln!("Erro: Conversão de data falhou.");
            return value.to_string(); // Retorna o valor original se a conversão falhar.
        }
    }

    // Para colunas que não são de data, retorna o valor original
    match value {
        DataType::String(s) => s.clone(),
        _ => value.to_string(),
    }
}

// Função para carregar o mapeamento de colunas a partir de um arquivo JSON
fn load_column_mapping(
    file_path: &str,
) -> Result<HashMap<String, String>, Box<dyn std::error::Error>> {
    let data = fs::read_to_string(file_path)?;
    let mapping: HashMap<String, String> = serde_json::from_str(&data)?;
    Ok(mapping)
}

// Função para aplicar o mapeamento aos nomes das colunas
fn map_column_name(column_name: &str, mapping: &HashMap<String, String>) -> String {
    mapping
        .get(column_name)
        .cloned()
        .unwrap_or_else(|| column_name.to_string())
}

fn extract_text_inside_brackets(text: &str) -> String {
    let re = Regex::new(r"\[(.*?)\]").unwrap();
    if let Some(caps) = re.captures(text) {
        caps[1].to_string()
    } else {
        text.to_string()
    }
}

fn remove_accents_and_symbols(text: &str) -> String {
    text.chars()
        .filter(|c| c.is_ascii_alphanumeric() || *c == '_')
        .collect()
}

fn snake_case(text: &str) -> String {
    let mut result = String::new();
    let mut prev_char_was_lowercase = false;
    let mut prev_char_was_uppercase = false;
    let mut prev_char_was_underscore = false;
    let mut prev_char_was_numeric = false;

    for c in text.chars() {
        if c.is_uppercase() {
            // Adiciona um sublinhado antes de letras maiúsculas, exceto no início
            // e quando a letra anterior também era maiúscula (para evitar "N_O_M").
            if (prev_char_was_lowercase || (!result.is_empty() && !prev_char_was_uppercase))
                && !prev_char_was_underscore
            {
                result.push('_');
            }
            result.push(c.to_ascii_lowercase());
            prev_char_was_lowercase = false;
            prev_char_was_uppercase = true;
            prev_char_was_underscore = false;
            prev_char_was_numeric = false;
        } else if c.is_lowercase() {
            // Adiciona um sublinhado antes de letras minúsculas, se o caractere anterior era um número
            if prev_char_was_numeric && !prev_char_was_underscore {
                result.push('_');
            }
            result.push(c);
            prev_char_was_lowercase = true;
            prev_char_was_uppercase = false;
            prev_char_was_underscore = false;
            prev_char_was_numeric = false;
        } else if c.is_numeric() {
            // Adiciona um sublinhado antes de números, se o caractere anterior era uma letra
            if (prev_char_was_lowercase || prev_char_was_uppercase) && !prev_char_was_underscore {
                result.push('_');
            }
            result.push(c);
            prev_char_was_lowercase = false;
            prev_char_was_uppercase = false;
            prev_char_was_underscore = false;
            prev_char_was_numeric = true;
        } else if c == '_' || c == ' ' {
            // Substitui espaços e sublinhados por um único sublinhado
            if !prev_char_was_underscore {
                result.push('_');
            }
            prev_char_was_lowercase = false;
            prev_char_was_uppercase = false;
            prev_char_was_underscore = true;
            prev_char_was_numeric = false;
        }
        // Ignora outros caracteres (símbolos, etc.)
    }

    result
}

fn convert_xlsx_to_json_divided(
    input_file_path: &str,
    output_dir: &str,
    mapping_file_path: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let column_mapping = load_column_mapping(mapping_file_path)?;
    let date_columns = load_date_columns()?; // Carrega os nomes das colunas que são datas

    let mut workbook: Xlsx<_> = open_workbook(input_file_path)?;
    let sheet_names: Vec<String> = workbook.sheet_names().into_iter().cloned().collect();

    for sheet_name in sheet_names {
        // Normaliza o nome da planilha
        let normalized_sheet_name = normalize_sheet_name(&sheet_name);

        let range = workbook
            .worksheet_range(&sheet_name)
            .ok_or("Planilha não encontrada")? // Lida com o Option
            .map_err(|_| "Erro ao acessar a planilha")?; // Lida com o Result

        let headers: Vec<String> = range
            .rows()
            .next()
            .ok_or("Planilha vazia")?
            .iter()
            .map(|cell| {
                let value = extract_text_inside_brackets(&cell.to_string());
                let value = remove_accents_and_symbols(&value);
                let value = snake_case(&value);
                map_column_name(&value, &column_mapping)
            })
            .collect();

        let data: Vec<Row> = range
            .rows()
            .skip(1)
            .map(|row| {
                let mut map = std::collections::HashMap::new();
                for (i, cell) in row.iter().enumerate() {
                    if let Some(header) = headers.get(i) {
                        let value = process_cell(cell, header, &date_columns);
                        map.insert(header.clone(), value);
                    }
                }
                Row { data: map }
            })
            .collect();

        let base_name = Path::new(input_file_path)
            .file_stem()
            .and_then(|s| s.to_str())
            .ok_or("Nome do arquivo inválido")?;

        //let output_folder_path = Path::new(output_dir).join(base_name).join(&sheet_name);

         // Usa o nome normalizado da planilha para criar a pasta
         let output_folder_path = Path::new(output_dir).join(base_name).join(&normalized_sheet_name);

        fs::create_dir_all(&output_folder_path)?;

        let chunk_size = 1000;
        for (i, chunk) in data.chunks(chunk_size).enumerate() {
            let chunk_file_path = output_folder_path.join(format!("part_{}.json", i + 1));
            let mut file = File::create(chunk_file_path)?;
            file.write_all(serde_json::to_string_pretty(chunk)?.as_bytes())?;
        }

        println!(
            "Conversão da planilha '{}' (normalizada para '{}') de {} para JSON divididos concluída.",
            sheet_name, normalized_sheet_name, input_file_path
        );
    }

    Ok(())
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() < 3 {
        eprintln!(
            "Uso: {} <arquivo_entrada.xlsx> <arquivo_mapeamento.json> [diretorio_saida]",
            args[0]
        );
        std::process::exit(1);
    }

    let input_file_path = &args[1];
    let mapping_file_path = &args[2];
    let output_dir = if args.len() > 3 {
        // Se um terceiro argumento for fornecido, use-o como diretório de saída
        args[2].clone()
    } else {
        // Caso contrário, use a mesma pasta do arquivo original
        let input_path = Path::new(input_file_path);
        let parent_dir = input_path
            .parent()
            .unwrap_or_else(|| Path::new(".")) // Se não houver diretório pai, use o diretório atual
            .to_str()
            .unwrap_or(".") // Se o caminho não puder ser convertido para string, use o diretório atual
            .to_string();
        parent_dir
    };

    if let Err(e) = convert_xlsx_to_json_divided(input_file_path, &output_dir, mapping_file_path) {
        eprintln!("Erro durante a conversão: {}", e);
        std::process::exit(1);
    }
}
