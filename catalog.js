// Static catalog of common Spanish supermarket products, used for the
// autocomplete dropdown on the Add screen. Not fetched live from any store —
// this is a fixed list bundled with the app (see README.md for why: no
// official Mercadona API exists, and their unofficial one blocks outside
// fetching). Each entry just needs a name and a category icon.

const D = "🥛", C = "🥩", P = "🐟", F = "🍎", V = "🥦", B = "🍞",
      Z = "🧊", G = "🥤", A = "🥫", S = "🍫", L = "🧴", H = "🧼",
      BB = "🍼", M = "🐾";

export const catalog = [
  // Lácteos y huevos
  ["Leche entera", D], ["Leche semidesnatada", D], ["Leche desnatada", D],
  ["Leche sin lactosa", D], ["Nata para cocinar", D], ["Nata para montar", D],
  ["Mantequilla", D], ["Margarina", D], ["Yogur natural", D],
  ["Yogur griego", D], ["Yogur de fresa", D], ["Yogur líquido", D],
  ["Queso cottage", D], ["Queso fresco", D], ["Queso rallado", D],
  ["Queso en lonchas", D], ["Queso de untar", D], ["Queso curado", D],
  ["Queso brie", D], ["Mozzarella", D], ["Huevos", D],
  ["Batido de chocolate", D], ["Kéfir", D], ["Requesón", D],

  // Carne
  ["Pechuga de pollo", C], ["Muslos de pollo", C], ["Pollo entero", C],
  ["Alitas de pollo", C], ["Filetes de ternera", C], ["Carne picada de ternera", C],
  ["Carne picada mixta", C], ["Chuletas de cerdo", C], ["Lomo de cerdo", C],
  ["Costillas de cerdo", C], ["Jamón cocido", C], ["Jamón serrano", C],
  ["Chorizo", C], ["Salchichón", C], ["Salchichas", C], ["Bacon", C],
  ["Panceta", C], ["Hamburguesas", C], ["Albóndigas", C],
  ["Pavo fileteado", C], ["Conejo", C],

  // Pescado y marisco
  ["Salmón", P], ["Merluza", P], ["Atún fresco", P], ["Atún en lata", P],
  ["Sardinas", P], ["Gambas", P], ["Langostinos", P], ["Calamares", P],
  ["Pulpo", P], ["Mejillones", P], ["Bacalao", P], ["Boquerones", P],
  ["Palitos de mar", P], ["Anchoas", P],

  // Frutas
  ["Manzanas", F], ["Plátanos", F], ["Naranjas", F], ["Peras", F],
  ["Fresas", F], ["Uvas", F], ["Sandía", F], ["Melón", F], ["Piña", F],
  ["Kiwi", F], ["Aguacate", F], ["Limones", F], ["Mandarinas", F],
  ["Melocotón", F], ["Ciruelas", F], ["Cerezas", F], ["Frutos rojos", F],
  ["Higos", F], ["Mango", F], ["Papaya", F],

  // Verduras y hortalizas
  ["Tomates", V], ["Lechuga", V], ["Cebollas", V], ["Ajos", V],
  ["Pimientos", V], ["Patatas", V], ["Zanahorias", V], ["Pepino", V],
  ["Calabacín", V], ["Berenjena", V], ["Brócoli", V], ["Coliflor", V],
  ["Espinacas", V], ["Champiñones", V], ["Judías verdes", V], ["Puerros", V],
  ["Calabaza", V], ["Apio", V], ["Rúcula", V], ["Espárragos", V],

  // Pan y bollería
  ["Pan de molde", B], ["Barra de pan", B], ["Pan integral", B],
  ["Pan de pita", B], ["Croissants", B], ["Magdalenas", B],
  ["Bollería variada", B], ["Tortitas", B], ["Tostadas", B],
  ["Pan rallado", B], ["Bizcocho", B], ["Donuts", B],

  // Congelados
  ["Guisantes congelados", Z], ["Pizza congelada", Z], ["Helado", Z],
  ["Croquetas congeladas", Z], ["Verdura congelada", Z],
  ["Pescado congelado", Z], ["Patatas fritas congeladas", Z],
  ["Nuggets de pollo", Z], ["Empanadillas", Z],

  // Bebidas
  ["Agua", G], ["Agua con gas", G], ["Refresco de cola", G],
  ["Zumo de naranja", G], ["Zumo de piña", G], ["Cerveza", G],
  ["Vino tinto", G], ["Vino blanco", G], ["Café molido", G],
  ["Café en grano", G], ["Té", G], ["Leche de avena", G],
  ["Leche de almendra", G], ["Bebida isotónica", G], ["Tónica", G], ["Mosto", G],

  // Despensa
  ["Aceite de oliva", A], ["Aceite de girasol", A], ["Vinagre", A],
  ["Sal", A], ["Azúcar", A], ["Harina", A], ["Arroz", A], ["Pasta", A],
  ["Garbanzos cocidos", A], ["Lentejas cocidas", A], ["Tomate frito", A],
  ["Tomate triturado", A], ["Mayonesa", A], ["Ketchup", A], ["Mostaza", A],
  ["Especias", A], ["Caldo de pollo", A], ["Atún en aceite", A],
  ["Aceitunas", A], ["Cereales", A], ["Miel", A], ["Mermelada", A],
  ["Cacao en polvo", A], ["Levadura", A],

  // Snacks y dulces
  ["Patatas fritas", S], ["Frutos secos", S], ["Chocolate", S],
  ["Galletas", S], ["Chicles", S], ["Caramelos", S], ["Palomitas", S],
  ["Barritas de cereales", S], ["Turrón", S], ["Gominolas", S],

  // Limpieza
  ["Detergente ropa", L], ["Suavizante", L], ["Lavavajillas", L],
  ["Friegasuelos", L], ["Papel higiénico", L], ["Papel de cocina", L],
  ["Servilletas", L], ["Bolsas de basura", L], ["Lejía", L],
  ["Estropajos", L], ["Guantes de goma", L], ["Ambientador", L],

  // Higiene y cuidado personal
  ["Gel de ducha", H], ["Champú", H], ["Pasta de dientes", H],
  ["Cepillo de dientes", H], ["Desodorante", H], ["Compresas", H],
  ["Tampones", H], ["Pañuelos", H], ["Crema hidratante", H],
  ["Maquinillas de afeitar", H], ["Colonia", H],

  // Bebé
  ["Pañales", BB], ["Toallitas", BB], ["Leche infantil", BB],
  ["Potitos", BB], ["Papilla", BB],

  // Mascotas
  ["Pienso para perro", M], ["Pienso para gato", M],
  ["Latas de comida para gato", M], ["Arena para gato", M],
  ["Snacks para perro", M],
].map(([name, icon]) => ({ name, icon }));
