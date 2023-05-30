// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import NavigationService from "../../infrastructure/navigation/services/navigation.service";

export default class BarCodeScanService {
  private readonly navigationService: NavigationService;

  private onScanHandler = BarCodeScanService.getDefaultOnScanHandler();

  constructor(navigationService: NavigationService) {
    this.navigationService = navigationService;
  }

  private static getDefaultOnScanHandler(): (data: string) => void {
    return (data: string) => {};
  }

  scanBarCode(onScanCallback?: (data: string) => any): void {
    this.onScanHandler = (data: string) => {
      if (onScanCallback) {
        onScanCallback(data);
      }
      this.onScanHandler = BarCodeScanService.getDefaultOnScanHandler();
    };
    this.navigationService.showBarCodeScanScreen();
  }

  onScan(data: string): void {
    this.onScanHandler(data);
  }
}
