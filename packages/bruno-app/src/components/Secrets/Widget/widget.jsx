import { useState } from 'react';
import { VaultCloudWidget } from 'components/Secrets/Widget/VaultCloud/vault-cloud';
import { VaultServerWidget } from 'components/Secrets/Widget/VaultServer/vault-server';

const withCommonProps =
  (WidgetComponent) =>
  ({ className, config, setConfig, platformConfig, setPlatformConfig, collection, saveSecretsRef }) =>
    (
      <WidgetComponent
        className={className}
        config={config}
        setConfig={setConfig}
        platformConfig={platformConfig}
        setPlatformConfig={setPlatformConfig}
        collection={collection}
        saveSecretsRef={saveSecretsRef}
      />
    );

const RenderWidget = ({
  type,
  className,
  config,
  setConfig,
  platformConfig,
  setPlatformConfig,
  collection,
  saveSecretsRef
}) => {
  switch (type) {
    case 'vault-cloud':
      return withCommonProps(VaultCloudWidget)({
        className,
        config,
        setConfig,
        platformConfig,
        setPlatformConfig,
        collection,
        saveSecretsRef
      });
    case 'vault-server':
      return withCommonProps(VaultServerWidget)({
        className,
        config,
        setConfig,
        platformConfig,
        setPlatformConfig,
        collection,
        saveSecretsRef
      });
    default:
      return <div>Unknown widget type</div>;
  }
};

export const SecretsWidget = ({ className, type, collection, instance, saveSecretsRef }) => {
  // contains secretConfig and sharedConfig
  const [config, setConfig] = useState({
    secretConfig: {},
    sharedConfig: instance || {},
    platformConfig: {
      getToken: () => {},
      getSecret: () => {}
    }
  });
  return (
    <RenderWidget
      type={type}
      className={className}
      config={config}
      setConfig={setConfig}
      collection={collection}
      saveSecretsRef={saveSecretsRef}
    />
  );
};
