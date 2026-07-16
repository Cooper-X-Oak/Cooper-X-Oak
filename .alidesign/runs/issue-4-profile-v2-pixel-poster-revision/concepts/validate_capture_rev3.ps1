param(
  [string]$Directory = (Join-Path $PSScriptRoot 'revision-003')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$tokens = @{
  bone = '#F2EFE4'
  ink = '#0D100E'
  forest = '#347A55'
  signal = '#3B9648'
}

$records = @()
Get-ChildItem -LiteralPath $Directory -Filter '*-320.png' | Sort-Object Name | ForEach-Object {
  $png = $_
  $svg = Join-Path $Directory ($png.BaseName + '.svg')
  if (-not (Test-Path -LiteralPath $svg)) { throw "Missing source SVG for $($png.Name)" }

  $bitmap = [System.Drawing.Bitmap]::FromFile($png.FullName)
  try {
    $counts = @{}
    $minX = $bitmap.Width
    $minY = $bitmap.Height
    $maxX = -1
    $maxY = -1
    $oakMinX = $bitmap.Width
    $oakMinY = $bitmap.Height
    $oakMaxX = -1
    $oakMaxY = -1
    $signalMinX = $bitmap.Width
    $signalMinY = $bitmap.Height
    $signalMaxX = -1
    $signalMaxY = -1
    $background = if ($png.Name -match '-dark-320\.png$') { $tokens.ink } else { $tokens.bone }

    for ($y = 0; $y -lt $bitmap.Height; $y++) {
      for ($x = 0; $x -lt $bitmap.Width; $x++) {
        $c = $bitmap.GetPixel($x, $y)
        $hex = ('#{0:X2}{1:X2}{2:X2}' -f $c.R, $c.G, $c.B)
        if (-not $counts.ContainsKey($hex)) { $counts[$hex] = 0 }
        $counts[$hex]++
        if ($hex -ne $background) {
          if ($x -lt $minX) { $minX = $x }
          if ($x -gt $maxX) { $maxX = $x }
          if ($y -lt $minY) { $minY = $y }
          if ($y -gt $maxY) { $maxY = $y }
        }
        if ($hex -eq $tokens.forest -or $hex -eq $(if ($background -eq $tokens.ink) { $tokens.bone } else { $tokens.ink })) {
          if ($x -lt $oakMinX) { $oakMinX = $x }
          if ($x -gt $oakMaxX) { $oakMaxX = $x }
          if ($y -lt $oakMinY) { $oakMinY = $y }
          if ($y -gt $oakMaxY) { $oakMaxY = $y }
        }
        if ($hex -eq $tokens.signal) {
          if ($x -lt $signalMinX) { $signalMinX = $x }
          if ($x -gt $signalMaxX) { $signalMaxX = $x }
          if ($y -lt $signalMinY) { $signalMinY = $y }
          if ($y -gt $signalMaxY) { $signalMaxY = $y }
        }
      }
    }

    $required = @($tokens.bone, $tokens.ink, $tokens.forest, $tokens.signal)
    foreach ($token in $required) {
      if (-not $counts.ContainsKey($token)) { throw "$($png.Name) is missing token $token" }
    }
    if ($bitmap.Width -ne 320 -or $bitmap.Height -ne 213) { throw "$($png.Name) has wrong dimensions" }
    if ($maxX -lt 0) { throw "$($png.Name) contains only the background" }

    $bboxWidth = $maxX - $minX + 1
    $bboxHeight = $maxY - $minY + 1
    $oakWidth = $oakMaxX - $oakMinX + 1
    $oakHeight = $oakMaxY - $oakMinY + 1
    if ($oakWidth -lt 168 -or $oakHeight -lt 120) { throw "$($png.Name) Oak bbox is too small: ${oakWidth}x${oakHeight}" }
    if ($maxX -ge $bitmap.Width -or $maxY -ge $bitmap.Height) { throw "$($png.Name) bbox exceeds the canvas" }

    $records += [ordered]@{
      png = $png.Name
      input_svg = [System.IO.Path]::GetFileName($svg)
      input_sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $svg).Hash.ToLowerInvariant()
      renderer = 'Brave headless'
      viewport = '320x213'
      device_scale_factor = 1
      width = $bitmap.Width
      height = $bitmap.Height
      unique_colors = $counts.Keys.Count
      token_counts = [ordered]@{
        bone = $counts[$tokens.bone]
        ink = $counts[$tokens.ink]
        forest = $counts[$tokens.forest]
        signal = $counts[$tokens.signal]
      }
      non_background_bbox = [ordered]@{
        left = $minX
        top = $minY
        right = $maxX
        bottom = $maxY
        width = $bboxWidth
        height = $bboxHeight
      }
      oak_bbox = [ordered]@{
        left = $oakMinX
        top = $oakMinY
        right = $oakMaxX
        bottom = $oakMaxY
        width = $oakWidth
        height = $oakHeight
      }
      signal_bbox = [ordered]@{
        left = $signalMinX
        top = $signalMinY
        right = $signalMaxX
        bottom = $signalMaxY
        width = ($signalMaxX - $signalMinX + 1)
        height = ($signalMaxY - $signalMinY + 1)
      }
    }
  }
  finally {
    $bitmap.Dispose()
  }
}

$report = [ordered]@{
  schema_version = 1
  capture_command = 'brave --headless=new --disable-gpu --hide-scrollbars --window-size=320,213 --screenshot=<png> <intrinsic-320-svg>'
  records = $records
}
$path = Join-Path $Directory 'capture-report.json'
$report | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $path -Encoding UTF8
Write-Output ($report | ConvertTo-Json -Depth 8)
