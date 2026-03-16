import '../../core/services/api_service.dart';
import '../../core/utils/network_checker.dart';
import '../local/farmer_dao.dart';
import '../models/farmer_model.dart';
import 'package:uuid/uuid.dart';

class FarmerRepository {
  Future<FarmerModel> createFarmer(FarmerModel farmer) async {
    final id = Uuid().v4();
    final newFarmer = FarmerModel(
      id: id,
      name: farmer.name,
      village: farmer.village,
      mobile: farmer.mobile,
      address: farmer.address,
      latitude: farmer.latitude,
      longitude: farmer.longitude,
      syncStatus: 'PENDING',
      createdAt: DateTime.now(),
    );

    await FarmerDao.insert(newFarmer);

    if (await NetworkChecker.isConnected()) {
      try {
        final response = await ApiService.post('/farmers', newFarmer.toJson());
        final syncedFarmer = FarmerModel.fromJson(response.data['data']);
        await FarmerDao.update(syncedFarmer);
        return syncedFarmer;
      } catch (e) {
        return newFarmer;
      }
    }

    return newFarmer;
  }

  Future<List<FarmerModel>> getAllFarmers() async {
    return await FarmerDao.getAll();
  }

  Future<void> syncPendingFarmers() async {
    final pending = await FarmerDao.getPending();
    for (var farmer in pending) {
      try {
        final response = await ApiService.post('/farmers', farmer.toJson());
        await FarmerDao.updateSyncStatus(farmer.id!, 'SYNCED');
      } catch (e) {
        print('Sync failed for farmer: ${farmer.id}');
      }
    }
  }

  Future<void> updateFarmer(FarmerModel farmer) async {
    await FarmerDao.update(farmer);
  }

  Future<void> deleteFarmer(String id) async {
    await FarmerDao.delete(id);
  }
}
