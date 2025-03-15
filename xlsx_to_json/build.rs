use std::fs;
use std::path::Path;

fn main() {
    let dest_path = Path::new("target").join("release").join("col_date.json");
    
    if let Err(e) = fs::copy("col_date.json", &dest_path) {
        eprintln!("Erro ao copiar col_date.json: {}", e);
    }

    let dest_path_debug = Path::new("target").join("debug").join("col_date.json");
    
    if let Err(e) = fs::copy("col_date.json", &dest_path_debug) {
        eprintln!("Erro ao copiar col_date.json (debug): {}", e);
    }
}
