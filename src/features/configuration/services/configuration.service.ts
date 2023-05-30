import { v4 as uuidv4 } from "uuid";
import Configuration, {
  ConfigurationData,
} from "../classes/configuration.class";
import DataSynchronizerService from "../../../services/applicationData/data-synchronizer.service";

type StateActions = {
  setConfiguration: (configuration: Configuration) => any;
};

export default class ConfigurationService {
  private readonly configuration: Configuration | undefined;

  private readonly dataSynchronizerService: DataSynchronizerService;

  private readonly stateActions: StateActions;

  constructor(
    dataSynchronizerService: DataSynchronizerService,
    stateActions: StateActions,
    configuration?: Configuration
  ) {
    this.dataSynchronizerService = dataSynchronizerService;
    this.stateActions = stateActions;
    this.configuration = configuration;
  }

  createConfiguration(data?: ConfigurationData): Configuration {
    const currentDate = new Date();
    const dataToSave = data ?? {
      productExpiringNotification: {
        enabled: false,
        hours: currentDate.getHours(),
        minutes: currentDate.getMinutes(),
        daysBefore: 3,
      },
    };

    return <Configuration>(
      this.dataSynchronizerService.attachOwnerUuid(
        new Configuration(uuidv4(), dataToSave)
      )
    );
  }

  saveConfiguration(configuration: Configuration): Promise<any> {
    return this.dataSynchronizerService.saveEntity(
      configuration,
      this.stateActions.setConfiguration
    );
  }

  getConfiguration() {
    return this.configuration;
  }
}
