import 'package:flutter/material.dart';
import '../../data/models/farmer_model.dart';
import '../../data/repositories/farmer_repository.dart';

class FarmerProvider with ChangeNotifier {
  final FarmerRepository _repository = FarmerRepository();
  List<FarmerModel> _farmers = [];
  bool _isLoading = false;

  List<FarmerModel> get farmers => _farmers;
  bool get isLoading => _isLoading;

  Future<void> loadFarmers() async {
    _isLoading = true;
    notifyListeners();

    try {
      _farmers = await _repository.getAllFarmers();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addFarmer(FarmerModel farmer) async {
    await _repository.createFarmer(farmer);
    await loadFarmers();
  }

  Future<void> syncFarmers() async {
    await _repository.syncPendingFarmers();
    await loadFarmers();
  }
}
