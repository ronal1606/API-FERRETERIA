const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
// Cargar variables de entorno desde .env
require('dotenv').config();
const { Cargo, Empleado, Cliente, Categoria, Marca, Producto, Venta, DetalleVenta } = require('./models');

// node index.js
// ======= Configuración de Express =======
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// Health check endpoint useful for Render and monitoring
app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
  res.json({ ok: state === 1, mongoState: state });
});

// ======= Configuración de MongoDB =======
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ La variable de entorno MONGODB_URI no está definida. Crea un archivo .env con la cadena de conexión.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ Conexión exitosa a MongoDB Atlas'))
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    console.error('Verifica tu usuario y contraseña en MongoDB Atlas');
  });

// ================== RUTAS ==================

// --- EMPLEADOS ---
// GET todos los empleados
app.get('/empleados', async (req, res) => {
  try {
    const empleados = await Empleado.find().populate('idcargo', 'nombre');
    res.json(empleados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET empleado por id
app.get('/empleados/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id).populate('idcargo', 'nombre');
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST crear empleado
app.post('/empleados', async (req, res) => {
  try {
    const empleado = new Empleado(req.body);
    const nuevoEmpleado = await empleado.save();
    res.status(201).json(nuevoEmpleado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT actualizar empleado
app.put('/empleados/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE eliminar empleado
app.delete('/empleados/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findByIdAndDelete(req.params.id);
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ message: 'Empleado eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CLIENTES ---
// GET todos los clientes
app.get('/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET cliente por id
app.get('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST crear cliente
app.post('/clientes', async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    const nuevoCliente = await cliente.save();
    res.status(201).json(nuevoCliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT actualizar cliente
app.put('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE eliminar cliente
app.delete('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PRODUCTOS ---
// GET todos los productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find()
      .populate('idmarca', 'nombre')
      .populate('idcategoria', 'nombre descripcion');
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET producto por id
app.get('/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate('idmarca', 'nombre')
      .populate('idcategoria', 'nombre descripcion');
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST crear producto
app.post('/productos', async (req, res) => {
  try {
    const producto = new Producto(req.body);
    const nuevoProducto = await producto.save();
    res.status(201).json(nuevoProducto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT actualizar producto
app.put('/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE eliminar producto
app.delete('/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CARGOS ---
app.get('/cargos', async (req, res) => {
  try {
    const cargos = await Cargo.find();
    res.json(cargos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/cargos', async (req, res) => {
  try {
    const cargo = new Cargo(req.body);
    const nuevoCargo = await cargo.save();
    res.status(201).json(nuevoCargo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- MARCAS ---
app.get('/marcas', async (req, res) => {
  try {
    const marcas = await Marca.find();
    res.json(marcas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/marcas', async (req, res) => {
  try {
    const marca = new Marca(req.body);
    const nuevaMarca = await marca.save();
    res.status(201).json(nuevaMarca);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CATEGORIAS ---
app.get('/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/categorias', async (req, res) => {
  try {
    const categoria = new Categoria(req.body);
    const nuevaCategoria = await categoria.save();
    res.status(201).json(nuevaCategoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- VENTAS ---
app.get('/ventas', async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate('idempleado', 'nombre')
      .populate('idcliente', 'nombre');
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/ventas', async (req, res) => {
  try {
    const venta = new Venta(req.body);
    const nuevaVenta = await venta.save();
    res.status(201).json(nuevaVenta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DETALLE VENTAS ---
app.get('/detalle-ventas', async (req, res) => {
  try {
    const detalles = await DetalleVenta.find()
      .populate('idproducto', 'nombre costo');
    res.json(detalles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/detalle-ventas', async (req, res) => {
  try {
    const detalle = new DetalleVenta(req.body);
    const nuevoDetalle = await detalle.save();
    res.status(201).json(nuevoDetalle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =================================================
app.listen(port, () => {
  console.log(`🚀 API corriendo en http://localhost:${port}`);
});