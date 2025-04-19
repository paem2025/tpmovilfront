import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButton,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import './Home.css';
import { useEffect, useState } from 'react';
import helper from '../services/helper';
import { Libro } from '../types/Libro';

const Home: React.FC = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const showData = async () => {
      try {
        const data = await helper.getAllLibros();
        setLibros(data);
      } catch (error) {
        console.error("Error al cargar libros en Home:", error);
      } finally {
        setLoading(false);
      }
    };
    showData();
  }, []);

  const eliminarLibro = async (id: number, nombre: string) => {
    const confirmacion = window.confirm(`¿Eliminar el libro "${nombre}"?`);
    if (!confirmacion) return;

    const eliminado = await helper.deleteLibro(id);
    if (eliminado) {
      try {
        const dataActualizada = await helper.getAllLibros();
        setLibros(dataActualizada);
        setShowToast(true); 
      } catch (err) {
        console.error("Error al recargar libros:", err);
      }
    } else {
      alert(`No se pudo eliminar el libro "${nombre}". Verificá si ya fue eliminado.`);
    }
  };

  const librosFiltrados = libros.filter((libro) => {
    const termino = busqueda.toLowerCase();
    return (
      libro.nombre.toLowerCase().includes(termino) ||
      libro.autor.toLowerCase().includes(termino) ||
      libro.editorial.toLowerCase().includes(termino) ||
      libro.genero.toLowerCase().includes(termino) ||
      libro.idioma.toLowerCase().includes(termino)
    );
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>📚 Catálogo de Libros</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonToast
          isOpen={showToast}
          message="📕 Libro eliminado con éxito"
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
          color="danger"
        />

        <div className="home-header">
          <h1 className="titulo">📖 CATÁLOGO DE LIBROS</h1>
          <div className="buscador-agregar">
            <IonSearchbar
              placeholder="Buscar libro..."
              className="searchbar-pequena"
              value={busqueda}
              onIonInput={(e) => setBusqueda(e.detail.value!)}
            />
            <IonButton color="success" routerLink="/formulario">
              ➕ Añadir Libro
            </IonButton>
          </div>
        </div>

        {loading ? (
          <div className="text-center mt-4">
            <IonSpinner name="dots" />
            <p>Cargando libros...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive mt-4">
              <table className="table table-hover table-bordered shadow-sm align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Portada</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>⭐</th>
                    <th>Fecha</th>
                    <th>Editorial</th>
                    <th>Género</th>
                    <th>Páginas</th>
                    <th>Idioma</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {librosFiltrados.map((libro) => (
                    <tr key={libro.id}>
                      <td>{libro.id}</td>
                      <td>
                        <img
                          src={libro.url_foto}
                          alt={libro.nombre}
                          width="60"
                          height="80"
                          style={{ objectFit: 'cover' }}
                        />
                      </td>
                      <td>{libro.nombre}</td>
                      <td>{libro.autor}</td>
                      <td>{libro.estrellas}</td>
                      <td>{libro.fecha_publicacion}</td>
                      <td>{libro.editorial}</td>
                      <td>{libro.genero}</td>
                      <td>{libro.cant_pag}</td>
                      <td>{libro.idioma}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-1">
                          ✏️
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminarLibro(libro.id, libro.nombre)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled">
                    <span className="page-link">Anterior</span>
                  </li>
                  <li className="page-item">
                    <span className="page-link">Siguiente</span>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="contenedor-boton mt-4 text-center">
              <IonButton color="tertiary" routerLink="/pageranking">
                ⭐ Ver Ranking Top 5
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;