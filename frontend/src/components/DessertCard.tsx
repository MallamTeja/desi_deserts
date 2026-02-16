import { getDessertImage } from "@/lib/dessert-images";

interface Dessert {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface DessertCardProps {
  dessert: Dessert;
  onOrder: (dessert: Dessert) => void;
}

const DessertCard = ({ dessert, onOrder }: DessertCardProps) => {

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
      <div className="p-5 space-y-3">
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
        <button
          onClick={() => onOrder(dessert)}
          className="btn-order w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          View Dessert
        </button>
      </div>
    </div>
  );
};

export default DessertCard;
