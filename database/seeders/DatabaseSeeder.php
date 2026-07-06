<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@warehouse.test'],
            ['name' => 'Admin Gudang', 'password' => bcrypt('password')]
        );

        $categories = collect([
            'Elektronik', 'Alat Tulis Kantor', 'Peralatan Rumah Tangga', 'Bahan Baku',
        ])->map(fn ($name) => Category::create(['name' => $name]));

        $suppliers = collect([
            ['name' => 'PT Sumber Makmur', 'contact_person' => 'Budi Santoso', 'phone' => '081234567890', 'email' => 'budi@sumbermakmur.co.id'],
            ['name' => 'CV Cahaya Abadi', 'contact_person' => 'Siti Amara', 'phone' => '082198765432', 'email' => 'siti@cahayaabadi.co.id'],
            ['name' => 'UD Sejahtera Jaya', 'contact_person' => 'Andi Wijaya', 'phone' => '087711223344', 'email' => 'andi@sejahterajaya.co.id'],
        ])->map(fn ($s) => Supplier::create($s));

        $warehouses = collect([
            ['code' => 'WH-CRB', 'name' => 'Gudang Cirebon Pusat', 'location' => 'Cirebon, Jawa Barat'],
            ['code' => 'WH-JKT', 'name' => 'Gudang Jakarta Timur', 'location' => 'Jakarta Timur'],
            ['code' => 'WH-SBY', 'name' => 'Gudang Surabaya', 'location' => 'Surabaya, Jawa Timur'],
        ])->map(fn ($w) => Warehouse::create($w));

        $products = collect([
            ['sku' => 'ELK-001', 'name' => 'Keyboard Mekanikal', 'unit' => 'pcs', 'price' => 450000, 'min_stock' => 10, 'category' => 0, 'supplier' => 0],
            ['sku' => 'ELK-002', 'name' => 'Mouse Wireless', 'unit' => 'pcs', 'price' => 150000, 'min_stock' => 15, 'category' => 0, 'supplier' => 0],
            ['sku' => 'ATK-001', 'name' => 'Kertas HVS A4 80gr', 'unit' => 'rim', 'price' => 55000, 'min_stock' => 20, 'category' => 1, 'supplier' => 1],
            ['sku' => 'ATK-002', 'name' => 'Pulpen Gel Hitam', 'unit' => 'box', 'price' => 35000, 'min_stock' => 10, 'category' => 1, 'supplier' => 1],
            ['sku' => 'RMH-001', 'name' => 'Kipas Angin Dinding', 'unit' => 'pcs', 'price' => 275000, 'min_stock' => 5, 'category' => 2, 'supplier' => 2],
            ['sku' => 'BHN-001', 'name' => 'Kain Katun Polos', 'unit' => 'meter', 'price' => 28000, 'min_stock' => 50, 'category' => 3, 'supplier' => 2],
        ])->map(function ($p) use ($categories, $suppliers) {
            return Product::create([
                'sku' => $p['sku'],
                'name' => $p['name'],
                'unit' => $p['unit'],
                'price' => $p['price'],
                'min_stock' => $p['min_stock'],
                'category_id' => $categories[$p['category']]->id,
                'supplier_id' => $suppliers[$p['supplier']]->id,
            ]);
        });

        // Seed initial stock per warehouse via stock movements (keeps history realistic).
        foreach ($products as $product) {
            foreach ($warehouses as $warehouse) {
                $initialQty = rand(5, 80);

                $product->warehouses()->attach($warehouse->id, ['quantity' => $initialQty]);

                StockMovement::create([
                    'product_id' => $product->id,
                    'warehouse_id' => $warehouse->id,
                    'user_id' => $user->id,
                    'type' => 'in',
                    'quantity' => $initialQty,
                    'reference' => 'STOK-AWAL',
                    'note' => 'Stok awal saat setup gudang.',
                ]);
            }
        }
    }
}
