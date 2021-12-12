param(
    [string]$source,
    [string]$dest
)

$ERRORACTIONPREFERENCE = 'Stop'
# Global Vars to use
# $source is the source to download from
# $dest is the root location of the plugin folder

Write-Output "Source: $source"
Write-Output "Destination: $dest"
# Download the zip file of the release
Invoke-WebRequest -Uri $source -Outfile ./tempPlugin.zip

# Expand the zip file archive
Expand-Archive ./tempPlugin.zip -Force

# Remove the original zip file
Remove-Item ./tempPlugin.zip -Recurse -Force -ErrorAction SilentlyContinue

$parentFileNameTemp = Get-ChildItem ./tempPlugin/ | Select Name
$parentFileName = $parentFileNameTemp[0].Name

# Move the new unzipped file to the correct location, discarding the original parent folder
Move-Item ./tempPlugin/$parentFileName -Destination $dest/$parentFileName -Force

# Finally remove the orphaned folder
Remove-Item ./tempPlugin/

# Now to operate on the JSON data at hand
try {
$newPackageJSON = Get-Content $dest/$parentFileName/package.json -raw | ConvertFrom-Json
$installedJSON = Get-Content $dest/installedPlugins.json -raw | ConvertFrom-Json
$availableJSON = Get-Content $dest/availablePlugins.json -raw | ConvertFrom-Json

# First we can change the value in the package JSON to write as needed
$newPackageJSON.installed = $true

# Add the new package.json to the installed list
$installedJSON += $newPackageJSON

# Converting to JSON then applying set content allowed single item arrays, to ensure this item is always an array
$writeTargetInstalled = ConvertTo-Json @($installedJSON) -depth 32

# This writes the new installed package file
Set-Content $dest/installedPlugins.json -Value $writeTargetInstalled -Force

# Then to write the package details back to the file
$writeTargetPackage = ConvertTo-Json $newPackageJSON -depth 32
Set-Content $dest/$parentFileName/package.json -Value $writeTargetPackage -Force

# Lastly to check the available list, find the proper listing and we can change its status to installed as well.
$availableJSON | % {if ($_.name -eq $parentFileName) {$_.installed = $true } }
$availableJSON | ConvertTo-Json -Depth 32 | Set-Content $dest/availablePlugins.json -Force

Write-Output "Successfully Installed!"
}
catch {
  Write-Warning $Error[0]
}
