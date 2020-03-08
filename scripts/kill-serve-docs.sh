#!/usr/bin/env bash

PID=`ps aux | grep scripts/serve-docs | grep -v grep | awk '{print $2}'`
if [ -n "$PID" ]; then
  kill -9 $PID
fi
