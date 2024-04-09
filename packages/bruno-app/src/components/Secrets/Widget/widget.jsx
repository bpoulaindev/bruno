import { useState } from 'react';
import { VaultCloudWidget } from 'components/Secrets/Widget/VaultCloud/vault-cloud';
import { VaultServerWidget } from 'components/Secrets/Widget/VaultServer/vault-server';

const withCommonProps =
  (WidgetComponent) =>
  ({ className, config, setConfig, platformConfig, setPlatformConfig }) =>
    <WidgetComponent className={className} {...config} {...setConfig} {...platformConfig} {...setPlatformConfig} />;

const RenderWidget = ({ type, className, config, setConfig, platformConfig, setPlatformConfig }) => {
  switch (type) {
    case 'Vault Cloud':
      return withCommonProps(VaultCloudWidget)({ className, config, setConfig, platformConfig, setPlatformConfig });
    case 'Vault Server':
      return withCommonProps(VaultServerWidget)({ className, config, setConfig, platformConfig, setPlatformConfig });
    default:
      return <div>Unknown widget type</div>;
  }
};

export const SecretsWidget = ({ className, type }) => {
  // contains secretConfig and sharedConfig
  const [config, setConfig] = useState({
    secretConfig: {},
    sharedConfig: {},
    platformConfig: {
      getToken: () => {},
      getSecret: () => {}
    }
  });
  return <RenderWidget type={type} className={className} config={config} setConfig={setConfig} />;
};
