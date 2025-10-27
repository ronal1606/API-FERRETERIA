const mongoose = require('mongoose');

// ========== ESQUEMA DE CARGO ==========
const cargoSchema = new mongoose.Schema({
  nombre: { type: String, required: true }
});

// ========== ESQUEMA DE EMPLEADO ==========
const empleadoSchema = new mongoose.Schema({
  dni: { type: String, required: true, maxlength: 8 },
  nombre: { type: String, required: true, maxlength: 150 },
  telefono: { type: String, required: true, maxlength: 11 },
  sexo: { type: String, required: true, maxlength: 1 },
  direccion: { type: String, required: true, maxlength: 100 },
  fecha_ingreso: { type: Date, required: true },
  salario: { type: Number, required: true },
  idcargo: { type: mongoose.Schema.Types.ObjectId, ref: 'Cargo', required: true },
  clave: { type: String, required: true, maxlength: 10 }
});

// ========== ESQUEMA DE CLIENTE ==========
const clienteSchema = new mongoose.Schema({
  dni: { type: String, required: true, maxlength: 8 },
  nombre: { type: String, required: true, maxlength: 150 },
  telefono: { type: String, required: true, maxlength: 11 },
  sexo: { type: String, required: true, maxlength: 1 },
  fecha_naci: { type: Date, required: true },
  direccion: { type: String, required: true, maxlength: 100 }
});

// ========== ESQUEMA DE CATEGORIA ==========
const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, maxlength: 200 },
  descripcion: { type: String, required: true, maxlength: 100 }
});

// ========== ESQUEMA DE MARCA ==========
const marcaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, maxlength: 100 }
});

// ========== ESQUEMA DE PRODUCTO ==========
const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, maxlength: 100 },
  costo: { type: Number, required: true },
  preciounit: { type: Number, required: true },
  stock: { type: Number, required: true },
  fecha_venci: { type: Date, required: true },
  idmarca: { type: mongoose.Schema.Types.ObjectId, ref: 'Marca', required: true },
  idcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true }
});

// ========== ESQUEMA DE VENTA ==========
const ventaSchema = new mongoose.Schema({
  numventa: { type: String, required: true, maxlength: 4, unique: true },
  fecha: { type: Date, required: true },
  idempleado: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado', required: true },
  idcliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true }
});

// ========== ESQUEMA DE DETALLE_VENTA ==========
const detalleVentaSchema = new mongoose.Schema({
  idventa: { type: String, required: true },
  idproducto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true }
});

// Crear modelos
const Cargo = mongoose.model('Cargo', cargoSchema);
const Empleado = mongoose.model('Empleado', empleadoSchema);
const Cliente = mongoose.model('Cliente', clienteSchema);
const Categoria = mongoose.model('Categoria', categoriaSchema);
const Marca = mongoose.model('Marca', marcaSchema);
const Producto = mongoose.model('Producto', productoSchema);
const Venta = mongoose.model('Venta', ventaSchema);
const DetalleVenta = mongoose.model('DetalleVenta', detalleVentaSchema);

module.exports = {
  Cargo,
  Empleado,
  Cliente,
  Categoria,
  Marca,
  Producto,
  Venta,
  DetalleVenta
};