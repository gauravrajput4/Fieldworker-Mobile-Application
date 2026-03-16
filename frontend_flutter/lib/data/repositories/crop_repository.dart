import '../../core/services/api_service.dart';
import '../../core/utils/network_checker.dart';
import '../local/crop_dao.dart';
import '../models/crop_model.dart';
import 'package:uuid/uuid.dart';

class CropRepository {
  Future<CropModel> createCrop(CropModel crop) async {
    final id = Uuid().v4();
    final newCrop = CropModel(
      id: id,
      farmerId: crop.farmerId,
      cropName: crop.cropName,
      cropType: crop.cropType,
      area: crop.area,
      season: crop.season,
      sowingDate: crop.sowingDate,
      imagePath: crop.imagePath,
      syncStatus: 'PENDING',
    );

    await CropDao.insert(newCrop);

    if (await NetworkChecker.isConnected()) {
      try {
        final response = await ApiService.post('/crops', newCrop.toJson());
        final syncedCrop = CropModel.fromJson(response.data['data']);
        await CropDao.update(syncedCrop);
        return syncedCrop;
      } catch (e) {
        return newCrop;
      }
    }

    return newCrop;
  }

  Future<void> syncPendingCrops() async {
    final pendingCrops = await CropDao.getPending();

    for (final crop in pendingCrops) {
      try {
        final response = await ApiService.post('/crops', crop.toJson());

        final syncedCrop = CropModel.fromJson(response.data['data']);

        await CropDao.update(syncedCrop.copyWith(syncStatus: "SYNCED"));

      } catch (e) {
        //
      }
    }
  }

  Future<List<CropModel>> getCropsByFarmer(String farmerId) async {
    return await CropDao.getByFarmerId(farmerId);
  }

  Future<List<CropModel>> getAllCrops() async {
    return await CropDao.getAll();
  }

  Future<void> updateCrop(CropModel crop) async {
    await CropDao.update(crop);
  }

  Future<void> deleteCrop(String id) async {
    await CropDao.delete(id);
  }
}
