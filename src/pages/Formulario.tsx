import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonInput, IonButton, IonButtons, IonBackButton, IonLabel,
  useIonToast, IonDatetime, IonPopover
} from '@ionic/react';
import './Formulario.css';
import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Formulario: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleSubmit = async () => {
    if (!libro.nombre.trim()) {
      present({ message: 'El nombre es obligatorio', duration: 2000, color: 'danger' });
      return;
    }

    if (!libro.autor.trim()) {
      present({ message: 'El autor es obligatorio', duration: 2000, color: 'danger' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/api/libros', {
        nombre: libro.nombre,
        autor: libro.autor,
        estrellas: libro.estrellas,
        fechaPublicacion: libro.fechaPublicacion,
        urlFoto: libro.urlFoto,
        editorial: libro.editorial,
        genero: libro.genero,
        cantPag: libro.cantPag,
        idioma: libro.idioma
      });
      
      console.log('Respuesta del servidor:', response.data);
      
      present({
        message: 'Libro guardado correctamente!',
        duration: 2000,
        color: 'success'
      });

      history.replace('/home');


      
    } catch (error) {
      console.error('Error al guardar:', error);
      present({
        message: 'Error al guardar. Verifica la conexión',
        duration: 3000,
        color: 'danger'
      });
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
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Añadir Libro</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="centered-form-content">
        <div className="form-wrapper">
          <div className="form-container">
            <h2 className="form-title">Información del Libro</h2>
            
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
              GUARDAR LIBRO
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Formulario;