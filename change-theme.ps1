# Theme Color Replacement Script
# Changes emerald/teal/green accent colors to slate/grey

$replacements = @{
    # Emerald to Slate replacements
    'emerald-100' = 'slate-200'
    'emerald-200' = 'slate-300'
    'emerald-300' = 'slate-400'
    'emerald-400' = 'slate-500'
    'emerald-500' = 'slate-600'
    'emerald-600' = 'slate-700'
    
    # Teal to Slate replacements
    'teal-100' = 'slate-200'
    'teal-200' = 'slate-300'
    'teal-300' = 'slate-400'
    'teal-400' = 'slate-500'
    'teal-500' = 'slate-600'
    'teal-600' = 'slate-700'
    
    # Cyan to Slate replacements
    'cyan-400' = 'slate-500'
    'cyan-500' = 'slate-600'
    'cyan-600' = 'slate-700'
}

$files = @(
    'app\page.tsx',
    'app\components\Sidebar.tsx',
    'app\components\ResponseViewer.tsx',
    'app\components\RequestBuilder.tsx',
    'app\components\AuthModal.tsx',
    'app\components\ApiEndpointView.tsx'
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    
    foreach ($key in $replacements.Keys) {
        $content = $content -replace $key, $replacements[$key]
    }
    
    Set-Content -Path $file -Value $content -NoNewline
    Write-Host "Updated: $file"
}

Write-Host "`nTheme changed from emerald/teal to slate/grey!"
