param(
    [string]$Source = ".alidesign/runs/issue-4-profile-v2-pixel-poster-revision/concepts/revision-002/00-monochrome-silhouette.png",
    [string]$OutputDirectory = ".alidesign/runs/issue-4-profile-v2-pixel-poster-revision/recognition-proxy"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$sourcePath = (Resolve-Path -LiteralPath $Source).Path
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$outputPath = (Resolve-Path -LiteralPath $OutputDirectory).Path

function Export-NearestNeighborPng {
    param(
        [System.Drawing.Image]$Image,
        [int]$Width,
        [int]$Height,
        [string]$Destination
    )

    $bitmap = [System.Drawing.Bitmap]::new($Width, $Height)
    try {
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.Clear([System.Drawing.Color]::FromArgb(242, 239, 228))
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
            $graphics.DrawImage($Image, 0, 0, $Width, $Height)
        }
        finally {
            $graphics.Dispose()
        }
        $bitmap.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
        $bitmap.Dispose()
    }
}

$sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
try {
    Export-NearestNeighborPng -Image $sourceImage -Width 860 -Height 573 -Destination (Join-Path $outputPath "stimulus-a.png")
    Export-NearestNeighborPng -Image $sourceImage -Width 320 -Height 213 -Destination (Join-Path $outputPath "stimulus-b.png")
}
finally {
    $sourceImage.Dispose()
}

$records = Get-ChildItem -LiteralPath $outputPath -Filter "stimulus-*.png" | Sort-Object Name | ForEach-Object {
    $image = [System.Drawing.Image]::FromFile($_.FullName)
    try {
        [ordered]@{
            file = $_.Name
            width = $image.Width
            height = $image.Height
            sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
        }
    }
    finally {
        $image.Dispose()
    }
}

[ordered]@{
    method = "nearest-neighbor projection from one monochrome raster source"
    source_sha256 = (Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash.ToLowerInvariant()
    stimuli = @($records)
} | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $outputPath "stimulus-manifest.json") -Encoding utf8

Get-Content -LiteralPath (Join-Path $outputPath "stimulus-manifest.json")
