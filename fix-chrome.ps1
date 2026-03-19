$root = 'c:\Users\Walancy\Documents\codes\whitelabel\src\components\layout'

# Headers - adicionar useChromeStyle
$hFiles = @(
  'taskplus\TaskplusHeader.tsx','resync\ReSyncHeader.tsx',
  'quantum\QuantumHeader.tsx','eevo\EevoHeader.tsx',
  'workly\WorklyHeader.tsx','projectli\ProjectliHeader.tsx',
  'magika\MagikaHeader.tsx'
)
foreach ($f in $hFiles) {
  $path = Join-Path $root $f
  $c = Get-Content $path -Raw
  if ($c -notmatch 'useChromeStyle') {
    $c = $c -replace "from '@/context/ThemeContext';", "from '@/context/ThemeContext';`nimport { useChromeStyle } from '@/context/ThemeContext';"
    # Remove duplicates if already had single import line
    $c = $c -replace "import \{ useTheme \} from '@/context/ThemeContext';`nimport \{ useChromeStyle \}", "import { useTheme, useChromeStyle } from '@/context/ThemeContext';"
    # Add hook inside the component (after opening brace of export)
    $c = $c -replace '(export const \w+Header = \(\) => \{)', "`$1`n  const chromeStyle = useChromeStyle();"
    # Replace bg-card on the header tag
    $c = $c -replace 'border-b bg-card border-border sticky top-0 z-40 font-sans transition-colors duration-300">', 'border-b border-border sticky top-0 z-40 font-sans transition-colors duration-300" style={chromeStyle}>'
    Set-Content $path $c -Encoding UTF8
    Write-Host "Updated header: $f"
  } else {
    Write-Host "Skip (already done): $f"
  }
}

# Sidebars - adicionar useChromeStyle
$sFiles = @(
  'workly\WorklySidebar.tsx','taskplus\TaskplusSidebar.tsx',
  'resync\ReSyncSidebar.tsx','quantum\QuantumSidebar.tsx',
  'magika\MagikaSidebar.tsx','eevo\EevoSidebar.tsx',
  'projectli\ProjectliSidebar.tsx'
)
foreach ($f in $sFiles) {
  $path = Join-Path $root $f
  $c = Get-Content $path -Raw
  if ($c -notmatch 'useChromeStyle') {
    $c = $c -replace "import \{ useTheme \} from '@/context/ThemeContext';", "import { useTheme, useChromeStyle } from '@/context/ThemeContext';"
    # Remove bg-card from aside className and add style
    $c = $c -replace 'bg-card border-r border-border', 'border-r border-border'
    # Add the hook + style after any existing useTheme() call in the component
    # Find pattern: const { theme } = useTheme(); and add chromeStyle after
    $c = $c -replace '(const \{ theme \} = useTheme\(\);)', "`$1`n  const chromeStyle = useChromeStyle();"
    $c = $c -replace '(const \[collapsed, setCollapsed\] = useState\(false\);)', "`$1`n  const chromeStyle = useChromeStyle();"
    # If still no chromeStyle added, add after first useState
    # Add style to aside
    $c = $c -replace '(collapsed \? "w-\S+ .*?" : "w-\S+.*?")\s*\}\)', "`$1`n    )} style={chromeStyle}"
    Set-Content $path $c -Encoding UTF8
    Write-Host "Updated sidebar: $f"
  } else {
    Write-Host "Skip (already done): $f"
  }
}
Write-Host "Done!"
