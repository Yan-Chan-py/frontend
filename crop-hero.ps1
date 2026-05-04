Add-Type -AssemblyName System.Drawing

$pairs = @(
    @{ src = "zz-render-desktop.png"; dst = "zz-hero-desktop.png"; h = 720 },
    @{ src = "zz-render-tablet.png";  dst = "zz-hero-tablet.png";  h = 760 },
    @{ src = "zz-render-mobile.png";  dst = "zz-hero-mobile.png";  h = 850 }
)

foreach ($p in $pairs) {
    $srcPath = Join-Path $PSScriptRoot $p.src
    $dstPath = Join-Path $PSScriptRoot $p.dst
    if (-not (Test-Path $srcPath)) {
        Write-Host "Missing: $srcPath"; continue
    }
    $img = [System.Drawing.Image]::FromFile($srcPath)
    $w = $img.Width
    $h = [Math]::Min($p.h, $img.Height)
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, 0, 0, (New-Object System.Drawing.Rectangle 0, 0, $w, $h), [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose(); $img.Dispose()
    Write-Host "Saved $dstPath ($w x $h)"
}
