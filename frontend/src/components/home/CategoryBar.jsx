// src/components/home/CategoryBar.jsx
import { Link } from 'react-router-dom';

const SPECIAL_CATS = [
  { slug: 'skin-care', name: 'Skin Care', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=80&h=80&fit=crop' },
  { slug: 'makeup', name: 'Makeup', image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf5f3d?w=80&h=80&fit=crop' },
  { slug: 'hair-care', name: 'Hair Care', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=80&h=80&fit=crop' },
];

const FALLBACK_CATS = [
  { slug: 'fragrances', name: 'Fragrances', image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=80&h=80&fit=crop' },
  { slug: 'body-care', name: 'Body Care', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4d73540?w=80&h=80&fit=crop' },
  { slug: 'nail-care', name: 'Nail Care', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=80&h=80&fit=crop' },
  { slug: 'tools', name: 'Tools', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=80&h=80&fit=crop' },
  { slug: 'sets', name: 'Gift Sets', image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=80&h=80&fit=crop' },
];

export default function CategoryBar({ categories }) {
  // Always include special categories at the start, then add database categories (excluding special ones)
  const dbCats = categories?.filter(cat => !['skin-care', 'makeup', 'hair-care'].includes(cat.slug)) || [];
  const cats = [...SPECIAL_CATS, ...dbCats, ...FALLBACK_CATS].slice(0, 8);
  return (
    <section className="category-bar">
      <div className="container">
        <div className="category-bar__scroll">
          {cats.map((cat) => (
            <Link key={cat.slug || cat.id} to={`/shop/${cat.slug}`} className="category-pill">
              <div className="category-pill__img">
                <img
                  src={cat.image || `https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=80&h=80&fit=crop`}
                  alt={cat.name}
                  loading="lazy"
                />
              </div>
              <span className="category-pill__name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
