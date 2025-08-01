'use client'
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Building, Home, DollarSign, BedDouble, Bath, Ruler, FileText, Plus, Upload, ArrowLeft, MapPin, LoaderCircle, Trash2 } from 'lucide-react';
import AsyncSelect from 'react-select/async';

// --- UI COMPONENTS (Maintained from your design) ---
const Header = () => (
    <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Building className="text-purple-600" size={28} />
                <span className="text-xl font-bold text-gray-800">ImóveisHuambo</span>
            </div>
        </div>
    </header>
);
const FormSection = ({ title, children }) => (<div className="bg-white p-6 rounded-xl shadow-md"><h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">{title}</h3><div className="space-y-4">{children}</div></div>);
const InputField = ({ icon, label, id, ...props }) => (<div><label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span><input id={id} {...props} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"/></div></div>);
const SelectField = ({ icon, label, id, children, ...props }) => (<div><label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span><select id={id} {...props} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none disabled:bg-gray-200">{children}</select></div></div>);

// --- MAIN PAGE COMPONENT (Adapted Logic) ---
export default function AddPropertyPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Form data states
    const [title, setTitle] = useState("");
    const [listingType, setListingType] = useState('para_arrendar');
    const [propertyType, setPropertyType] = useState("");
    const [price, setPrice] = useState("");
    const [displayPrice, setDisplayPrice] = useState("");
    const [beds, setBeds] = useState("");
    const [baths, setBaths] = useState("");
    const [width, setWidth] = useState("");
    const [length, setLength] = useState("");
    const [description, setDescription] = useState("");
    const [amenities, setAmenities] = useState([]);
    const [imageGallery, setImageGallery] = useState([{ file: null, previewUrl: '' }]);

    // Dynamic location data states
    const [provincias, setProvincias] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [selectedMunicipio, setSelectedMunicipio] = useState('');
    const [selectedBairro, setSelectedBairro] = useState(null);

    // UI control states
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Effect to check authentication
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    // Effect to fetch provinces
    useEffect(() => {
        const fetchProvincias = async () => {
            try {
                const response = await fetch('/api/localizacoes/provincias');
                const data = await response.json();
                setProvincias(data);
                if (data.length > 0) {
                    setSelectedProvincia(data[0].id);
                }
            } catch (err) {
                setError('Falha ao carregar províncias.');
            }
        };
        fetchProvincias();
    }, []);

    // Effect to fetch municipalities when province changes
    useEffect(() => {
        if (!selectedProvincia) return;
        const fetchMunicipios = async () => {
            try {
                const response = await fetch(`/api/localizacoes/municipios?provinciaId=${selectedProvincia}`);
                const data = await response.json();
                setMunicipios(data);
            } catch (err) {
                setError('Falha ao carregar municípios.');
            }
        };
        fetchMunicipios();
        setSelectedMunicipio('');
        setSelectedBairro(null);
    }, [selectedProvincia]);
    
    // --- FORM HANDLER FUNCTIONS ---
    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        setPrice(rawValue);
        setDisplayPrice(new Intl.NumberFormat('de-DE').format(Number(rawValue) || 0));
    };

    const handleImageChange = (index, file) => {
        const newGallery = [...imageGallery];
        newGallery[index].file = file;
        newGallery[index].previewUrl = URL.createObjectURL(file);
        setImageGallery(newGallery);
    };

    const addImageSlot = () => setImageGallery([...imageGallery, { file: null, previewUrl: '' }]);
    const removeImageSlot = (index) => setImageGallery(imageGallery.filter((_, i) => i !== index));

    const handleAmenityChange = (amenity) => {
        setAmenities((prev) => prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]);
    };

    const loadBairros = async (inputValue) => {
        if (!selectedMunicipio) return [];
        const response = await fetch(`/api/localizacoes/bairros?municipioId=${selectedMunicipio}&query=${inputValue}`);
        const data = await response.json();
        return data.map(bairro => ({ value: bairro.id, label: bairro.nome }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // A LINHA DE DIAGNÓSTICO
        console.log("DADOS ANTES DE ENVIAR:", { title, listingType, propertyType, price, beds, baths, width, length, description, amenities, bairroId: selectedBairro?.value });
        
        setError(null);

        // Field validation
        if (!selectedBairro || !selectedBairro.value) {
            setError('Erro de validação: Por favor, selecione um bairro.');
            return;
        }
        if (imageGallery.length === 0 || !imageGallery.some(img => img.file)) {
            setError('Erro de validação: Por favor, adicione pelo menos uma imagem.');
            return;
        }
        
        setSubmitting(true);
        const formData = new FormData();
        const propertyData = {
            title, listingType, propertyType, price, beds, baths, width, length, description, amenities,
            bairroId: selectedBairro.value,
        };

        formData.append('data', JSON.stringify(propertyData));
        imageGallery.forEach((img) => {
            if (img.file) {
                formData.append('images', img.file);
            }
        });

        // ... dentro de handleSubmit, depois de criar o formData

// Usamos toast.promise para feedback dinâmico
await toast.promise(
  fetch('/api/imoveis', { method: 'POST', body: formData })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao cadastrar imóvel.');
      }
      return response.json();
    }),
  {
    loading: 'A publicar o seu anúncio...',
    success: (data) => {
      router.push('/'); // Redireciona em caso de sucesso
      return 'Anúncio publicado com sucesso!';
    },
    error: (err) => err.message, // Mostra o erro da API
  }
);

setSubmitting(false); // O finally não é mais necessário com esta estrutura
            setSubmitting(false);
        
    };

    if (status === 'loading') {
        return <div className="flex items-center justify-center min-h-screen"><LoaderCircle className="animate-spin h-10 w-10 text-purple-600" /></div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Publicar Novo Imóvel</h1>
                        <button onClick={() => router.push('/')} className="flex items-center text-gray-600 hover:text-purple-600 font-semibold"><ArrowLeft size={20} className="mr-2"/>Voltar</button>
                    </div>

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <FormSection title="Objetivo do Anúncio">
                            <div className="flex rounded-lg bg-gray-100 p-1">
                                <button type="button" onClick={() => setListingType('para_arrendar')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${listingType === 'para_arrendar' ? 'bg-purple-600 text-white' : 'text-gray-600'}`}>Arrendar</button>
                                <button type="button" onClick={() => setListingType('para_venda')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${listingType === 'para_venda' ? 'bg-purple-600 text-white' : 'text-gray-600'}`}>Vender</button>
                            </div>
                        </FormSection>

                        <FormSection title="Informações Básicas">
                            <InputField icon={<FileText size={20}/>} label="Título do Anúncio" id="title" type="text" placeholder="Ex: Vivenda T3 com Quintal" value={title} onChange={e => setTitle(e.target.value)} required/>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectField icon={<Home size={20}/>} label="Tipo de Imóvel" value={propertyType} onChange={e => setPropertyType(e.target.value)} required>
                                    <option value="" disabled>Selecione</option>
                                    {['Apartamento', 'Vivenda', 'Moradia', 'Terreno', 'Loja', 'Armazém', 'Escritório', 'Quinta'].map(type => <option key={type} value={type}>{type}</option>)}
                                </SelectField>
                                <InputField icon={<DollarSign size={20}/>} label={listingType === 'para_arrendar' ? "Preço (AOA/mês)" : "Preço (AOA)"} id="price" type="text" placeholder="1.500.000" value={displayPrice} onChange={handlePriceChange} required/>
                            </div>
                        </FormSection>
                        
                        <FormSection title="Localização">
                            <SelectField icon={<MapPin size={20} />} label="Província" value={selectedProvincia} disabled>
                                {provincias.map(prov => (<option key={prov.id} value={prov.id}>{prov.nome}</option>))}
                            </SelectField>
                            <SelectField icon={<MapPin size={20} />} label="Município" value={selectedMunicipio} onChange={e => setSelectedMunicipio(e.target.value)} disabled={!selectedProvincia}>
                                <option value="" disabled>Selecione um município</option>
                                {municipios.map(mun => (<option key={mun.id} value={mun.id}>{mun.nome}</option>))}
                            </SelectField>
                            <div>
                                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                                <AsyncSelect id="bairro" cacheOptions loadOptions={loadBairros} defaultOptions value={selectedBairro} onChange={setSelectedBairro} placeholder="Pesquise e selecione um bairro..." isDisabled={!selectedMunicipio} styles={{ control: (base) => ({ ...base, minHeight: '42px', backgroundColor: '#F9FAFB', borderColor: '#D1D5DB', borderRadius: '0.5rem', '&:hover': { borderColor: '#A78BFA' }, boxShadow: 'none' })}}/>
                            </div>
                        </FormSection>

                        <FormSection title="Detalhes do Imóvel">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField icon={<BedDouble size={20}/>} label="Quartos" id="beds" type="number" min="0" placeholder="3" value={beds} onChange={e => setBeds(e.target.value)} required/>
                                <InputField icon={<Bath size={20}/>} label="Casas de Banho (WC)" id="baths" type="number" min="0" placeholder="2" value={baths} onChange={e => setBaths(e.target.value)} required/>
                                <div className="flex items-center space-x-2">
                                     <InputField icon={<Ruler size={20}/>} label="Largura (m)" id="width" type="number" min="0" placeholder="15" value={width} onChange={e => setWidth(e.target.value)}/>
                                     <InputField icon={<Ruler size={20}/>} label="Comprimento (m)" id="length" type="number" min="0" placeholder="20" value={length} onChange={e => setLength(e.target.value)}/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea id="description" rows="4" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Descreva os detalhes do seu imóvel..." value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                            </div>
                        </FormSection>

                         <FormSection title="Comodidades">
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Garagem', 'Quintal', 'Piscina', 'Ar Condicionado', 'Cozinha Equipada', 'Varanda', 'Segurança 24h', 'Elevador'].map(item => (
                                     <div key={item} className="flex items-center">
                                         <input id={item} type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" checked={amenities.includes(item)} onChange={() => handleAmenityChange(item)}/>
                                         <label htmlFor={item} className="ml-2 text-gray-700">{item}</label>
                                     </div>
                                 ))}
                             </div>
                         </FormSection>
                         
                         <FormSection title="Galeria de Imagens">
                             <div className="space-y-4">
                                {imageGallery.map((image, index) => (
                                     <div key={index} className="flex items-center space-x-4 p-2 border rounded-lg">
                                         <label htmlFor={`image-upload-${index}`} className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-500 bg-gray-50">
                                             {image.previewUrl ? <img src={image.previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg"/> : <Upload size={32} className="text-gray-400"/>}
                                             <input id={`image-upload-${index}`} type="file" accept="image/*" className="sr-only" onChange={(e) => handleImageChange(index, e.target.files[0])}/>
                                         </label>
                                         <div className="flex-grow">
                                             <InputField icon={<Home size={20}/>} label="Nome do Compartimento (opcional)" id={`compartment-name-${index}`} type="text" placeholder="Ex: Sala de Estar" />
                                         </div>
                                         <button type="button" onClick={() => removeImageSlot(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full" disabled={imageGallery.length <= 1}><Trash2 size={20}/></button>
                                     </div>
                                 ))}
                             </div>
                             <button type="button" onClick={addImageSlot} className="mt-4 flex items-center text-purple-600 font-semibold hover:underline"><Plus size={18} className="mr-2"/>Adicionar mais uma imagem</button>
                         </FormSection>

                        <div className="pt-4">
                            {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                            <div className="flex justify-end">
                                <button type="submit" disabled={submitting || status !== 'authenticated'} className="flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                    {submitting ? <LoaderCircle size={20} className="animate-spin mr-2"/> : <Plus size={20} className="mr-2"/>}
                                    Publicar Anúncio
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}