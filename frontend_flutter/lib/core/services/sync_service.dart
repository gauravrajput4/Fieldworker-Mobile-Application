import 'package:workmanager/workmanager.dart';
import '../utils/network_checker.dart';
import '../../data/repositories/farmer_repository.dart';
import '../../data/repositories/crop_repository.dart';

class SyncService {
  static void initialize() {
    Workmanager().initialize(callbackDispatcher);
  }

  static void registerPeriodicSync() {
    Workmanager().registerPeriodicTask(
      'sync-task',
      'syncData',
      frequency: Duration(minutes: 15),
    );
  }

  static Future<void> syncNow() async {
    if (await NetworkChecker.isConnected()) {
      await FarmerRepository().syncPendingFarmers();
      await CropRepository().syncPendingCrops();
    }
  }
}

@pragma('vm:entry-point')
void callbackDispatcher() {
  Workmanager().executeTask((task, inputData) async {
    await SyncService.syncNow();
    return Future.value(true);
  });
}
