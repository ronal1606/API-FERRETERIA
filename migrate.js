const { Pool } = require('pg');
const mongoose = require('mongoose');
const { Cargo, Empleado, Cliente, Categoria, Marca, Producto, Venta, DetalleVenta } = require('./models');

// Cargar variables de entorno desde .env
require('dotenv').config();

// Configuración PostgreSQL
const pgPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_ferreteria',
  password: 'ronal',
  port: 5432,
});

// Configuración MongoDB - leer desde variable de entorno
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ La variable de entorno MONGODB_URI no está definida. Crea un archivo .env con la cadena de conexión.');
  process.exit(1);
}

async function migrarDatos() {
  let pgClient;
  
  try {
    console.log('🔄 Iniciando proceso de migración...\n');
    
    // Conectar a MongoDB primero
    console.log('📡 Intentando conectar a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas\n');

    // Conectar a PostgreSQL
    console.log('📡 Intentando conectar a PostgreSQL...');
    pgClient = await pgPool.connect();
    console.log('✅ Conectado a PostgreSQL\n');

    // Mapeo de IDs: PostgreSQL -> MongoDB
    const cargoMap = {};
    const empleadoMap = {};
    const clienteMap = {};
    const categoriaMap = {};
    const marcaMap = {};
    const productoMap = {};

    // 1. Migrar CARGOS
    console.log('📦 Migrando cargos...');
    const cargosResult = await pgClient.query('SELECT * FROM cargo ORDER BY idcargo');
    console.log(`   Encontrados: ${cargosResult.rows.length} registros`);
    for (const cargo of cargosResult.rows) {
      const nuevoCargo = await Cargo.create({
        nombre: cargo.nombre
      });
      cargoMap[cargo.idcargo] = nuevoCargo._id;
      console.log(`  ✓ Cargo migrado: ${cargo.nombre} (ID: ${cargo.idcargo} -> ${nuevoCargo._id})`);
    }

    // 2. Migrar CATEGORIAS
    console.log('\n📦 Migrando categorías...');
    const categoriasResult = await pgClient.query('SELECT * FROM categoria ORDER BY idcategoria');
    console.log(`   Encontrados: ${categoriasResult.rows.length} registros`);
    for (const categoria of categoriasResult.rows) {
      const nuevaCategoria = await Categoria.create({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion
      });
      categoriaMap[categoria.idcategoria] = nuevaCategoria._id;
      console.log(`  ✓ Categoría migrada: ${categoria.nombre}`);
    }

    // 3. Migrar MARCAS
    console.log('\n📦 Migrando marcas...');
    const marcasResult = await pgClient.query('SELECT * FROM marca ORDER BY idmarca');
    console.log(`   Encontrados: ${marcasResult.rows.length} registros`);
    for (const marca of marcasResult.rows) {
      const nuevaMarca = await Marca.create({
        nombre: marca.nombre
      });
      marcaMap[marca.idmarca] = nuevaMarca._id;
      console.log(`  ✓ Marca migrada: ${marca.nombre}`);
    }

    // 4. Migrar EMPLEADOS
    console.log('\n📦 Migrando empleados...');
    const empleadosResult = await pgClient.query('SELECT * FROM empleado ORDER BY idempleado');
    console.log(`   Encontrados: ${empleadosResult.rows.length} registros`);
    for (const empleado of empleadosResult.rows) {
      const nuevoEmpleado = await Empleado.create({
        dni: empleado.dni,
        nombre: empleado.nombre,
        telefono: empleado.telefono,
        sexo: empleado.sexo,
        direccion: empleado.direccion,
        fecha_ingreso: empleado.fecha_ingreso,
        salario: parseFloat(empleado.salario),
        idcargo: cargoMap[empleado.idcargo],
        clave: empleado.clave
      });
      empleadoMap[empleado.idempleado] = nuevoEmpleado._id;
      console.log(`  ✓ Empleado migrado: ${empleado.nombre}`);
    }

    // 5. Migrar CLIENTES
    console.log('\n📦 Migrando clientes...');
    const clientesResult = await pgClient.query('SELECT * FROM cliente ORDER BY idcliente');
    console.log(`   Encontrados: ${clientesResult.rows.length} registros`);
    for (const cliente of clientesResult.rows) {
      const nuevoCliente = await Cliente.create({
        dni: cliente.dni,
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        sexo: cliente.sexo,
        fecha_naci: cliente.fecha_naci,
        direccion: cliente.direccion
      });
      clienteMap[cliente.idcliente] = nuevoCliente._id;
      console.log(`  ✓ Cliente migrado: ${cliente.nombre}`);
    }

    // 6. Migrar PRODUCTOS
    console.log('\n📦 Migrando productos...');
    const productosResult = await pgClient.query('SELECT * FROM producto ORDER BY idproducto');
    console.log(`   Encontrados: ${productosResult.rows.length} registros`);
    for (const producto of productosResult.rows) {
      const nuevoProducto = await Producto.create({
        nombre: producto.nombre,
        costo: parseFloat(producto.costo),
        preciounit: parseFloat(producto.preciounit),
        stock: producto.stock,
        fecha_venci: producto.fecha_venci,
        idmarca: marcaMap[producto.idmarca],
        idcategoria: categoriaMap[producto.idcategoria]
      });
      productoMap[producto.idproducto] = nuevoProducto._id;
      console.log(`  ✓ Producto migrado: ${producto.nombre}`);
    }

    // 7. Migrar VENTAS
    console.log('\n📦 Migrando ventas...');
    const ventasResult = await pgClient.query('SELECT * FROM venta ORDER BY numventa');
    console.log(`   Encontrados: ${ventasResult.rows.length} registros`);
    for (const venta of ventasResult.rows) {
      await Venta.create({
        numventa: venta.numventa,
        fecha: venta.fecha,
        idempleado: empleadoMap[venta.idempleado],
        idcliente: clienteMap[venta.idcliente]
      });
      console.log(`  ✓ Venta migrada: ${venta.numventa}`);
    }

    // 8. Migrar DETALLE_VENTA
    console.log('\n📦 Migrando detalles de venta...');
    const detallesResult = await pgClient.query('SELECT * FROM detalle_venta ORDER BY idventa, idproducto');
    console.log(`   Encontrados: ${detallesResult.rows.length} registros`);
    for (const detalle of detallesResult.rows) {
      await DetalleVenta.create({
        idventa: detalle.idventa,
        idproducto: productoMap[detalle.idproducto],
        cantidad: detalle.cantidad,
        precio: parseFloat(detalle.precio)
      });
      console.log(`  ✓ Detalle venta migrado: ${detalle.idventa} - Producto ID: ${detalle.idproducto}`);
    }

    console.log('\n🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!');
    console.log('\n📊 Resumen:');
    console.log(`   - Cargos: ${Object.keys(cargoMap).length}`);
    console.log(`   - Categorías: ${Object.keys(categoriaMap).length}`);
    console.log(`   - Marcas: ${Object.keys(marcaMap).length}`);
    console.log(`   - Empleados: ${Object.keys(empleadoMap).length}`);
    console.log(`   - Clientes: ${Object.keys(clienteMap).length}`);
    console.log(`   - Productos: ${Object.keys(productoMap).length}`);
    console.log(`   - Ventas: ${ventasResult.rows.length}`);
    console.log(`   - Detalles de venta: ${detallesResult.rows.length}`);

  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA MIGRACIÓN:');
    console.error('Tipo de error:', error.name);
    console.error('Mensaje:', error.message);
    
    if (error.code) {
      console.error('Código de error:', error.code);
    }
    
    if (error.stack) {
      console.error('\nStack trace completo:');
      console.error(error.stack);
    }
    
  } finally {
    // Cerrar conexiones
    if (pgClient) {
      pgClient.release();
      console.log('\n👋 Conexión PostgreSQL cerrada');
    }
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('👋 Conexión MongoDB cerrada');
    }
    
    await pgPool.end();
    console.log('👋 Pool PostgreSQL cerrado');
  }
}

// Ejecutar migración
console.log('🚀 Iniciando script de migración...\n');
migrarDatos();