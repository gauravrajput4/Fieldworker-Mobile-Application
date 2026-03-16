import 'package:flutter/material.dart';
import '../providers/farmer_provider.dart';
import '../providers/auth_provider.dart';
import 'package:provider/provider.dart';

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<FarmerProvider>(context, listen: false).loadFarmers();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard'),
        backgroundColor: Color(0xFF2E7D32),
        actions: [
          IconButton(
            icon: Icon(Icons.sync),
            onPressed: () => Navigator.pushNamed(context, '/sync-status'),
          ),
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () async {
              await Provider.of<AuthProvider>(context, listen: false).logout();
              Navigator.pushReplacementNamed(context, '/login');
            },
          ),
        ],
      ),
      body: GridView.count(
        crossAxisCount: 2,
        padding: EdgeInsets.all(16),
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        children: [
          _buildDashboardCard(
            'Farmers',
            Icons.people,
            Colors.blue,
            () => Navigator.pushNamed(context, '/farmers'),
          ),
          _buildDashboardCard(
            'Add Farmer',
            Icons.person_add,
            Colors.green,
            () => Navigator.pushNamed(context, '/farmer-registration'),
          ),
          _buildDashboardCard(
            'Crops',
            Icons.grass,
            Colors.orange,
                () => Navigator.pushNamed(context, '/crops'),
          ),
          _buildDashboardCard(
            'Sync Status',
            Icons.cloud_sync,
            Colors.purple,
            () => Navigator.pushNamed(context, '/sync-status'),
          ),
        ],
      ),
    );
  }

  Widget _buildDashboardCard(String title, IconData icon, Color color, VoidCallback onTap) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 64, color: color),
            SizedBox(height: 12),
            Text(
              title,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
