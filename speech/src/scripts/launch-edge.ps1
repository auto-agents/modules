param([String]$url = 'page:blank') 
Start-Process -FilePath "microsoft-edge:$url" -WindowStyle Minimized
Sleep 1
(Get-Process -Name msedge).MainWindowHandle | foreach { Set-WindowStyle MINIMIZE $_ }
