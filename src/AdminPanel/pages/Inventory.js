import BulkUpdateInventory from "../components/BulkUpdateInventory";
import LowStockAlerts from "../components/LowStockAlerts";
import ProductList from "../components/ProductList"
import RealTimeStock from "../components/RealTimeStock";

export default function Inventory() {
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            <div className="flex flex-col justify-between gap-6">
                <LowStockAlerts />
                <RealTimeStock />
                <BulkUpdateInventory />
            </div>
            <ProductList />         
        </div>
    )
}