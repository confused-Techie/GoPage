$curDir = pwd;

Add-Content .\config.yml "`n  staticAssets: '$pwd\assets\'";
Add-Content .\config.yml "  templates: '$pwd\templates\'";
Add-Content .\config.yml "  data: '$pwd\list.json'";
