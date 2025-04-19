import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonInput, IonButton, IonButtons, IonBackButton, IonLabel,
  useIonToast, IonDatetime, IonPopover, IonLoading
} from '@ionic/react';
import './Formulario.css';
import helper from '../services/helper';
import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const Formulario: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();
  const [present] = useIonToast();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const [libro, setLibro] = useState({
      nombre: '',
      autor: '',
      estrellas: 3.0,
      fechaPublicacion: new Date().toISOString().split('T')[0],
      urlFoto: '',
      editorial: '',
      genero: '',
      cantPag: 0,
      idioma: ''
  });

  const isEditing = !!id;

  useEffect(() => {
      const cargarLibroParaEditar = async () => {
          if (isEditing && id) {
              setLoading(true);
              try {
                  const libroData = await helper.getLibroById(Number(id));
                  if (libroData) {
                      setLibro(libroData);
                  } else {
                      present({ message: 'Libro no encontrado', duration: 2000, color: 'warning' });
                      history.replace('/home');
                  }
              } catch (error) {
                  console.error('Error al cargar libro para editar:', error);
                  present({ message: 'Error al cargar el libro', duration: 2000, color: 'danger' });
                  history.replace('/home');
              } finally {
                  setLoading(false);
              }
          }
      };
      cargarLibroParaEditar();
  }, [id, isEditing, history, present]);

  const handleSubmit = async () => {
      if (!libro.nombre.trim()) {
          present({ message: 'El nombre es obligatorio', duration: 2000, color: 'danger' });
          return;
      }

      if (!libro.autor.trim()) {
          present({ message: 'El autor es obligatorio', duration: 2000, color: 'danger' });
          return;
      }

      setLoading(true);
      try {
          let response;
          if (isEditing && id) {
              // Editar un libro.
              response = await helper.patchLibro(Number(id), libro);
              if (response) {
                  present({ message: 'Libro actualizado correctamente!', duration: 2000, color: 'success' });
                  history.replace('/home');
              } else {
                  present({ message: 'Error al actualizar el libro', duration: 2000, color: 'danger' });
              }
          } else {
              // Añadir un libro nuevo.
              response = await helper.createLibro(libro);
              console.log('Respuesta del servidor (creación):', response ? response : 'Error en la creación');
              if (response) {
                  present({ message: 'Libro guardado correctamente!', duration: 2000, color: 'success' });
                  history.replace('/home');
              } else {
                  present({ message: 'Error al guardar el libro', duration: 2000, color: 'danger' });
              }
          }
      } catch (error) {
          console.error('Error al guardar/actualizar:', error);
          present({ message: 'Error al guardar/actualizar. Verifica la conexión', duration: 3000, color: 'danger' });
      } finally {
          setLoading(false);
      }
  };

  const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
      <IonPage className="centered-form-page">
          <IonHeader>
              <IonToolbar>
                  <IonButtons slot="start">
                      <IonBackButton defaultHref="/home" />
                  </IonButtons>
                  <IonTitle>{isEditing ? 'Editar Libro' : 'Añadir Libro'}</IonTitle> {/** Depende la accion muestra una cabecera distinta. */}
              </IonToolbar>
          </IonHeader>

          <IonContent className="centered-form-content">
              <div className="form-wrapper">
                  <div className="form-container">
                      <h2 className="form-title">{isEditing ? 'Editar Información del Libro' : 'Información del Libro'}</h2>

                      <div className="form-group">
                          <IonLabel className="form-label">Nombre *</IonLabel>
                          <IonInput
                              value={libro.nombre}
                              onIonChange={e => setLibro({...libro, nombre: e.detail.value!})}
                              className="form-input"
                          />
                      </div>

                      <div className="form-group">
                          <IonLabel className="form-label">Autor *</IonLabel>
                          <IonInput
                              value={libro.autor}
                              onIonChange={e => setLibro({...libro, autor: e.detail.value!})}
                              className="form-input"
                          />
                      </div>

                      <div className="form-group">
                          <IonLabel className="form-label">Estrellas (1-5) *</IonLabel>
                          <IonInput
                              type="number"
                              step="0.5"
                              min="1"
                              max="5"
                              value={libro.estrellas}
                              onIonChange={e => setLibro({...libro, estrellas: parseFloat(e.detail.value!)})}
                              className="form-input"
                          />
                      </div>

                      <div className="form-group">
                          <IonLabel className="form-label">Fecha Publicación</IonLabel>
                          <IonInput
                              value={formatDate(libro.fechaPublicacion)}
                              readonly
                              onClick={() => setShowDatePicker(true)}
                              className="form-input"
                          />
                          <IonPopover
                              isOpen={showDatePicker}
                              onDidDismiss={() => setShowDatePicker(false)}
                          >
                              <IonDatetime
                                  presentation="date"
                                  value={libro.fechaPublicacion}
                                  onIonChange={e => {
                                      setLibro({...libro, fechaPublicacion: e.detail.value!.toString().split('T')[0]});
                                      setShowDatePicker(false);
                                  }}
                              />
                          </IonPopover>
                      </div>

                      <div className="form-group">
                          <IonLabel className="form-label">URL Foto</IonLabel>
                          <IonInput
                              value={libro.urlFoto}
                              onIonChange={e => setLibro({...libro, urlFoto: e.detail.value!})}
                              className="form-input"
                          />
                      </div>

                      <div className="form-group">
                          <IonLabel className="form-label">Editorial</IonLabel>
                          <IonInput
                              value={libro.editorial}
                              onIonChange={e => setLibro({...libro, editorial: e.detail.value!})}
                              className="form-input"
                          />
                      </div>

                      <div className="form-group">
                          <IonLabel className="form-label">Género</IonLabel>
                          <IonInput
                              value={libro.genero}
                              onIonChange={e => setLibro({...libro, genero: e.detail.value!})}
                              className="form-input"
                          />
                      </div>

                      <div className="form-group">
                          <IonLabel className="form-label">Páginas</IonLabel>
                          <IonInput
                              type="number"
                              value={libro.cantPag}
                              onIonChange={e => setLibro({...libro, cantPag: Number(e.detail.value!)})}
                              className="form-input"
                          />
                      </div>

                      <div className="form-group">
                          <IonLabel className="form-label">Idioma</IonLabel>
                          <IonInput
                              value={libro.idioma}
                              onIonChange={e => setLibro({...libro, idioma: e.detail.value!})}
                              className="form-input"
                          />
                      </div>

                      <IonButton
                          expand="block"
                          onClick={handleSubmit}
                          className="submit-btn"
                      >
                          {isEditing ? 'GUARDAR CAMBIOS' : 'GUARDAR LIBRO'}
                      </IonButton>
                  </div>
              </div>
          </IonContent>
      </IonPage>
  );
};

export default Formulario;