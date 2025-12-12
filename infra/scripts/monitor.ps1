# monitor.ps1
# Basic Infra Monitoring Script for Windows

Write-Host "===== System Monitoring Started ====="

# CPU Usage
$cpu = Get-Counter '\Processor(_Total)\% Processor Time'
Write-Host "🖥️ CPU Usage: " $cpu.CounterSamples.CookedValue "%"

# Memory Usage
$mem = Get-Counter '\Memory\Available MBytes'
Write-Host "💾 Available Memory: " $mem.CounterSamples.CookedValue " MB"

# Disk Usage (C drive)
$disk = Get-WmiObject Win32_LogicalDisk -Filter "DeviceID='C:'"
$freeGB = [math]::Round($disk.FreeSpace / 1GB, 2)
$totalGB = [math]::Round($disk.Size / 1GB, 2)
$usedGB = $totalGB - $freeGB
Write-Host "📂 Disk Usage (C:): Used $usedGB GB / Total $totalGB GB"

# Top 5 Processes by CPU
Write-Host "`n⚡ Top 5 Processes by CPU:"
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 | Format-Table -AutoSize Id, ProcessName, CPU

# Top 5 Processes by Memory
Write-Host "`n⚡ Top 5 Processes by Memory:"
Get-Process | Sort-Object PM -Descending | Select-Object -First 5 | Format-Table -AutoSize Id, ProcessName, PM

Write-Host "===== Monitoring Complete ====="

