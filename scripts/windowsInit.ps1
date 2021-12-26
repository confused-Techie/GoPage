$curDir = pwd;

Add-Content .\config.yml "`n  staticAssets: '$pwd\assets\'";
Add-Content .\config.yml "  templates: '$pwd\templates\'";
Add-Content .\config.yml "  data: '$pwd\list.json'";
Add-Content .\config.yml "  plugin: '$pwd\plugins\'";
Add-Content .\config.yml "  setting: '$pwd\settings\'";
Add-Content .\config.yml "  script: '$pwd\scripts\'";
