import { getDessertImage } from "@/lib/dessert-images";

interface Dessert {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
}

interface DessertCardProps {
  dessert: Dessert;
  onOrder: (dessert: Dessert) => void;
}

const DessertCard = ({ dessert, onOrder }: DessertCardProps) => {
  const isSoldOut = dessert.stock <= 0;
  const isLowStock = dessert.stock > 0 && dessert.stock <= 20;

  return (
    <div className="card-dessert">
      <div className="aspect-square overflow-hidden">
        <img
          src={getDessertImage(dessert.image_url)}
          alt={dessert.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4 md:p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl font-semibold text-foreground">
            {dessert.name}
          </h3>
          <span className="font-display text-lg font-bold text-primary whitespace-nowrap">
            ₹{dessert.price}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {dessert.description}
        </p>
        <div className="flex items-center justify-between pt-1">
          {isSoldOut ? (
            <span className="stock-badge-out">Sold Out</span>
          ) : isLowStock ? (
            <span className="stock-badge-low">Only {dessert.stock} left</span>
          ) : (
            <span className="stock-badge-available">{dessert.stock}/200 available</span>
          )}
        </div>
        <button
          onClick={() => onOrder(dessert)}
          disabled={isSoldOut}
          className={isSoldOut ? "btn-sold-out w-full" : "btn-order w-full"}
        >
          {isSoldOut ? "SOLD OUT" : "Order Now"}
        </button>
      </div>
    </div>
  );
};

export default DessertCard;
