import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { products } from "./catalog";

type CartItem = { id: string; size: number; quantity: number };
type Store = { cart: CartItem[]; wishlist: string[]; cartOpen: boolean; setCartOpen:(v:boolean)=>void; add:(id:string,size?:number)=>void; change:(id:string,size:number,delta:number)=>void; toggleWishlist:(id:string)=>void; count:number; subtotal:number };
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart,setCart] = useState<CartItem[]>([]); const [wishlist,setWishlist]=useState<string[]>([]); const [cartOpen,setCartOpen]=useState(false); const [ready,setReady]=useState(false);
  useEffect(()=>{ try { setCart(JSON.parse(localStorage.getItem("itrkunj-cart") || "[]")); setWishlist(JSON.parse(localStorage.getItem("itrkunj-wishlist") || "[]")); } catch {} setReady(true); },[]);
  useEffect(()=>{ if(ready){ localStorage.setItem("itrkunj-cart",JSON.stringify(cart)); localStorage.setItem("itrkunj-wishlist",JSON.stringify(wishlist)); } },[cart,wishlist,ready]);
  const add=(id:string,size=6)=>{ setCart(c=>{ const found=c.find(i=>i.id===id&&i.size===size); return found?c.map(i=>i===found?{...i,quantity:i.quantity+1}:i):[...c,{id,size,quantity:1}] }); toast.success("Added to your bag"); };
  const change=(id:string,size:number,delta:number)=>setCart(c=>c.map(i=>i.id===id&&i.size===size?{...i,quantity:i.quantity+delta}:i).filter(i=>i.quantity>0));
  const toggleWishlist=(id:string)=>{ setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]); toast("Wishlist updated"); };
  const count=cart.reduce((s,i)=>s+i.quantity,0); const subtotal=cart.reduce((s,i)=>s+(products.find(p=>p.id===i.id)?.price||0)*(i.size/6)*i.quantity,0);
  const value=useMemo(()=>({cart,wishlist,cartOpen,setCartOpen,add,change,toggleWishlist,count,subtotal}),[cart,wishlist,cartOpen,count,subtotal]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export const useStore=()=>{ const value=useContext(StoreContext); if(!value) throw new Error("StoreProvider missing"); return value; };