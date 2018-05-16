import path from "path";

// Replace the custom Babel transform in react-scripts with the one from this
// package. We do this to force the use of a preset with TypeScript support.
const replaceBabelTransform = (settingValue: string) =>
  /babelTransform\.js/.test(settingValue)
    ? path.resolve(__dirname, "rewireBabelTransform.js")
    : settingValue;

const rewireJest = (config: any) => {
  const settingKeys = Object.keys(config);

  /* tslint:disable-next-line */
  for (let i = 0; i < settingKeys.length; i += 1) {
    const setting = config[settingKeys[i]];

    if (Array.isArray(setting)) {
      // Replace file extensions in setting arrays.
      for (let j = 0; j < setting.length; j += 1) {
        setting[j] = setting[j].replace("js,jsx,mjs", "ts,tsx,js,jsx");
        setting[j] = setting[j].replace("js|jsx|mjs", "ts|tsx|js|jsx");
      }
    } else if (typeof setting === "object") {
      // Replace file extensions in keys of setting dictionaries.
      const settingObj = {};

      Object.keys(setting).forEach(settingObjKey => {
        const newSettingsObjKey = settingObjKey.replace(
          "js|jsx",
          "ts|tsx|js|jsx"
        );
        const newSettingValue = replaceBabelTransform(setting[settingObjKey]);
        // @ts-ignore
        settingObj[newSettingsObjKey] = newSettingValue;
      });

      config[settingKeys[i]] = settingObj;
    }
  }

  config.moduleFileExtensions.push("ts", "tsx", "web.ts");

  return config;
};

export default rewireJest;
