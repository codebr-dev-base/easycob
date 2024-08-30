#!/bin/bash

# Defina o caminho do backend
severPath="/data/app/easycob/backend/build"

# Defina o caminho para os arquivos de log
logDir="$severPath/logs"

# Crie o diretório de logs, se não existir
mkdir -p "$logDir"

# Função para iniciar uma fila com nohup
start_queue() {
    queueName=$1
    command="node $severPath/build/ace jobs:listen --queue=$queueName"
    outLog="$logDir/$queueName.out.log"
    errLog="$logDir/$queueName.err.log"
    pidFile="$logDir/$queueName.pid"

    nohup $command > "$outLog" 2> "$errLog" &
    echo $! > "$pidFile"
    echo "$queueName iniciado com nohup. Logs: $outLog, $errLog"
}

# Função para parar uma fila
stop_queue() {
    queueName=$1
    pidFile="$logDir/$queueName.pid"

    if [ -f "$pidFile" ]; then
        pid=$(cat "$pidFile")
        if kill -0 $pid > /dev/null 2>&1; then
            kill $pid
            echo "$queueName parado. PID: $pid"
        else
            echo "$queueName já está parado."
        fi
        rm -f "$pidFile"
    else
        echo "PID file para $queueName não encontrado. A fila pode não estar em execução."
    fi
}

# Verifica se a primeira entrada do comando é 'start' ou 'stop'
case "$1" in
    start)
        # Iniciando as filas
        start_queue "LoadCsv"
        start_queue "SendRecupera"
        start_queue "SendEmailRecupera"
        start_queue "SendSmsRecupera"
        start_queue "SendEmail"
        start_queue "SendSms"
        start_queue "SendInvoice"
        echo "Todas as filas foram iniciadas com sucesso!"
        ;;
    stop)
        # Parando as filas
        stop_queue "LoadCsv"
        stop_queue "SendRecupera"
        stop_queue "SendEmailRecupera"
        stop_queue "SendSmsRecupera"
        stop_queue "SendEmail"
        stop_queue "SendSms"
        stop_queue "SendInvoice"
        echo "Todas as filas foram paradas com sucesso!"
        ;;
    *)
        echo "Uso: $0 {start|stop}"
        exit 1
        ;;
esac
