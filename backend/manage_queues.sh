#!/bin/bash

# Defina o caminho do backend
severPath="/data/app/easycob/backend"

# Defina o caminho para os arquivos de log
logDir="$severPath/logs"

# Crie o diretório de logs, se não existir
mkdir -p "$logDir"

# Função para iniciar uma fila com nohup
start_queue_LoadCsv() {
    nohup node $severPath/build/ace.js jobs:listen --queue=LoadCsv --concurrency=4 > "$logDir/LoadCsv.out.log" 2> "$logDir/LoadCsv.err.log" &
    echo $! > "$logDir/LoadCsv.pid"
    echo "LoadCsv iniciado com nohup. Logs: $logDir/LoadCsv.out.log, $logDir/LoadCsv.err.log"
}

start_queue_SendRecupera() {
    nohup node $severPath/build/ace.js jobs:listen --queue=SendRecupera --concurrency=4 > "$logDir/SendRecupera.out.log" 2> "$logDir/SendRecupera.err.log" &
    echo $! > "$logDir/SendRecupera.pid"
    echo "SendRecupera iniciado com nohup. Logs: $logDir/SendRecupera.out.log, $logDir/SendRecupera.err.log"
}

start_queue_SendEmailRecupera() {
    nohup node $severPath/build/ace.js jobs:listen --queue=SendEmailRecupera --concurrency=4 > "$logDir/SendEmailRecupera.out.log" 2> "$logDir/SendEmailRecupera.err.log" &
    echo $! > "$logDir/SendEmailRecupera.pid"
    echo "SendEmailRecupera iniciado com nohup. Logs: $logDir/SendEmailRecupera.out.log, $logDir/SendEmailRecupera.err.log"
}

start_queue_SendSmsRecupera() {
    nohup node $severPath/build/ace.js jobs:listen --queue=SendSmsRecupera --concurrency=4 > "$logDir/SendSmsRecupera.out.log" 2> "$logDir/SendSmsRecupera.err.log" &
    echo $! > "$logDir/SendSmsRecupera.pid"
    echo "SendSmsRecupera iniciado com nohup. Logs: $logDir/SendSmsRecupera.out.log, $logDir/SendSmsRecupera.err.log"
}

start_queue_SendEmail() {
    nohup node $severPath/build/ace.js jobs:listen --queue=SendEmail --concurrency=4 > "$logDir/SendEmail.out.log" 2> "$logDir/SendEmail.err.log" &
    echo $! > "$logDir/SendEmail.pid"
    echo "SendEmail iniciado com nohup. Logs: $logDir/SendEmail.out.log, $logDir/SendEmail.err.log"
}

start_queue_SendSms() {
    nohup node $severPath/build/ace.js jobs:listen --queue=SendSms --concurrency=4 > "$logDir/SendSms.out.log" 2> "$logDir/SendSms.err.log" &
    echo $! > "$logDir/SendSms.pid"
    echo "SendSms iniciado com nohup. Logs: $logDir/SendSms.out.log, $logDir/SendSms.err.log"
}

start_queue_SendInvoice() {
    nohup node $severPath/build/ace.js jobs:listen --queue=SendInvoice --concurrency=4 > "$logDir/SendInvoice.out.log" 2> "$logDir/SendInvoice.err.log" &
    echo $! > "$logDir/SendInvoice.pid"
    echo "SendInvoice iniciado com nohup. Logs: $logDir/SendInvoice.out.log, $logDir/SendInvoice.err.log"
}

# Função para parar uma fila
stop_queue_LoadCsv() {
    pidFile="$logDir/LoadCsv.pid"

    if [ -f "$pidFile" ]; then
        pid=$(cat "$pidFile")
        if kill -0 $pid > /dev/null 2>&1; then
            kill $pid
            echo "LoadCsv parado. PID: $pid"
        else
            echo "LoadCsv já está parado."
        fi
        rm -f "$pidFile"
    else
        echo "PID file para LoadCsv não encontrado. A fila pode não estar em execução."
    fi
}

stop_queue_SendRecupera() {
    pidFile="$logDir/SendRecupera.pid"

    if [ -f "$pidFile" ]; então
        pid=$(cat "$pidFile")
        if kill -0 $pid > /dev/null 2>&1; então
            kill $pid
            echo "SendRecupera parado. PID: $pid"
        else
            echo "SendRecupera já está parado."
        fi
        rm -f "$pidFile"
    else
        echo "PID file para SendRecupera não encontrado. A fila pode não estar em execução."
    fi
}

stop_queue_SendEmailRecupera() {
    pidFile="$logDir/SendEmailRecupera.pid"

    if [ -f "$pidFile" ]; então
        pid=$(cat "$pidFile")
        if kill -0 $pid > /dev/null 2>&1; então
            kill $pid
            echo "SendEmailRecupera parado. PID: $pid"
        else
            echo "SendEmailRecupera já está parado."
        fi
        rm -f "$pidFile"
    else
        echo "PID file para SendEmailRecupera não encontrado. A fila pode não estar em execução."
    fi
}

stop_queue_SendSmsRecupera() {
    pidFile="$logDir/SendSmsRecupera.pid"

    if [ -f "$pidFile" ]; então
        pid=$(cat "$pidFile")
        if kill -0 $pid > /dev/null 2>&1; então
            kill $pid
            echo "SendSmsRecupera parado. PID: $pid"
        else
            echo "SendSmsRecupera já está parado."
        fi
        rm -f "$pidFile"
    else
        echo "PID file para SendSmsRecupera não encontrado. A fila pode não estar em execução."
    fi
}

stop_queue_SendEmail() {
    pidFile="$logDir/SendEmail.pid"

    if [ -f "$pidFile" ]; então
        pid=$(cat "$pidFile")
        if kill -0 $pid > /dev/null 2>&1; então
            kill $pid
            echo "SendEmail parado. PID: $pid"
        else
            echo "SendEmail já está parado."
        fi
        rm -f "$pidFile"
    else
        echo "PID file para SendEmail não encontrado. A fila pode não estar em execução."
    fi
}

stop_queue_SendSms() {
    pidFile="$logDir/SendSms.pid"

    if [ -f "$pidFile" ]; então
        pid=$(cat "$pidFile")
        if kill -0 $pid > /dev/null 2>&1; então
            kill $pid
            echo "SendSms parado. PID: $pid"
        else
            echo "SendSms já está parado."
        fi
        rm -f "$pidFile"
    else
        echo "PID file para SendSms não encontrado. A fila pode não estar em execução."
    fi
}

stop_queue_SendInvoice() {
    pidFile="$logDir/SendInvoice.pid"

    if [ -f "$pidFile" ]; então
        pid=$(cat "$pidFile")
        if kill -0 $pid > /dev/null 2>&1; então
            kill $pid
            echo "SendInvoice parado. PID: $pid"
        else
            echo "SendInvoice já está parado."
        fi
        rm -f "$pidFile"
    else
        echo "PID file para SendInvoice não encontrado. A fila pode não estar em execução."
    fi
}

# Verifica se a primeira entrada do comando é 'start' ou 'stop'
case "$1" in
    start)
        start_queue_LoadCsv
        start_queue_SendRecupera
        start_queue_SendEmailRecupera
        start_queue_SendSmsRecupera
        start_queue_SendEmail
        start_queue_SendSms
        start_queue_SendInvoice
        echo "Todas as filas foram iniciadas com sucesso!"
        ;;
    stop)
        stop_queue_LoadCsv
        stop_queue_SendRecupera
        stop_queue_SendEmailRecupera
        stop_queue_SendSmsRecupera
        stop_queue_SendEmail
        stop_queue_SendSms
        stop_queue_SendInvoice
        echo "Todas as filas foram paradas com sucesso!"
        ;;
    *)
        echo "Uso: $0 {start|stop}"
        exit 1
        ;;
esac
