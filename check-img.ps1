Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('C:\Users\user\flora\images\hero-bouquet.jpg')
Write-Host ("Hero image: {0}x{1}" -f $img.Width, $img.Height)
$img.Dispose()
