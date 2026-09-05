import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { favoritesApi } from '../api';
import { useAuth } from './AuthContext';
import type { Favorite } from '../types';

interface FavCtx {
  favorites: Favorite[];
  isFav: (type: string, id: number) => boolean;
  toggle: (type: string, id: number) => Promise<void>;
}

const FavContext = createContext<FavCtx>(null!);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    if (user) favoritesApi.list().then(setFavorites).catch(() => {});
    else setFavorites([]);
  }, [user]);

  const isFav = (type: string, id: number) =>
    favorites.some(f => f.item_type === type && f.item_id === id);

  const toggle = async (type: string, id: number) => {
    const existing = favorites.find(f => f.item_type === type && f.item_id === id);
    if (existing) {
      await favoritesApi.remove(existing.id);
      setFavorites(prev => prev.filter(f => f.id !== existing.id));
    } else {
      const fav = await favoritesApi.add({ item_type: type, item_id: id });
      setFavorites(prev => [...prev, fav]);
    }
  };

  return <FavContext.Provider value={{ favorites, isFav, toggle }}>{children}</FavContext.Provider>;
}

export const useFavorites = () => useContext(FavContext);
