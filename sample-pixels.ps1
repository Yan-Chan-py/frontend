Add-Type -AssemblyName System.Drawing

param(
    [string]$file = 'zz-render-desktop.png',
    [int[]]$xs = @(50, 200, 500, 800, 1000, 1100, 1200, 1300, 1400, 1439),
    [int]$y = 300
)

$path = Join-Path $PSScriptRoot $file
$img = [System.Drawing.Image]::FromFile($path)
$bmp = New-Object System.Drawing.Bitmap $img
$img.Dispose()

Write-Host "Image: $file -> $($bmp.Width)x$($bmp.Height), sampling y=$y"
foreach ($x in $xs) {
    if ($x -ge $bmp.Width) { continue }
    $px = $bmp.GetPixel($x, $y)
    Write-Host ("  x={0,4}  R={1,3} G={2,3} B={3,3}  hex=#{4:X2}{5:X2}{6:X2}" -f $x, $px.R, $px.G, $px.B, $px.R, $px.G, $px.B)
}
$bmp.Dispose()
