#!/bin/bash

# Define the script names
scripts=("LoadCsv" "SendRecupera" "SendEmailRecupera" "SendSmsRecupera" "SendEmail" "SendSms" "SendInvoice")

# Check the first argument to determine the action
case "$1" in
  start)
    for script in "${scripts[@]}"; do
      nohup node ace jobs:listen --queue="$script" --concurrency=4 > "${script}_output.log" 2> "${script}_error.log" &
      echo "Started $script, output logged to ${script}_output.log and errors to ${script}_error.log"
    done
    ;;
  stop)
    for pid in $(pgrep -f "node ace jobs:listen"); do
      kill "$pid"
      echo "Stopped process with PID $pid"
    done
    ;;
  restart)
    "$0" stop
    sleep 2
    "$0" start
    ;;
  *)
    echo "Usage: $0 {start|stop|restart}"
    exit 1
    ;;
esac
