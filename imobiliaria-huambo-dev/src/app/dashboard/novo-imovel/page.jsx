'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Building, Home, DollarSign, BedDouble, Bath, Ruler, FileText, Plus, Upload, ArrowLeft, MapPin, LoaderCircle, Trash2 } from 'lucide-react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import CreatableSelect from 'react-select/creatable'; // <-- NOVO IMPORT
import Image from 'next/image';

// --- COMPONENTES DE UI (Sem alterações) ---
const Header = () => ( <header className="bg-white shadow-sm sticky top-0 z-30"> <div className="container mx-auto px-4 py-4 flex items-center justify-between"> <div className="flex items-center space-x-3"> <Image src="/imobiliaria-logo.png" alt="Logótipo Imobiliária Huambo" width={40} height={40} /> <span className="text-xl font-bold text-dark-background">ImóveisHuambo</span> </div> </div> </header> );
const FormSection = ({ title, children }) => ( <motion.div className="bg-white p-6 rounded-xl shadow-md" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}> <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">{title}</h3><div className="space-y-4">{children}</div> </motion.div> );
const InputField = ({ icon, label, id, ...props }) => (<div><label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span><input id={id} {...props} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"/></div></div>);
const SelectField = ({ icon, label, id, children, ...props }) => (<div><label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span><select id={id} {...props} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none disabled:bg-gray-200">{children}</select></div></div>);

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function AddPropertyPage() {
    // ... (todos os seus 'useState' e 'useRouter', 'useSession' continuam iguais)
    const { data: session, status } = useSession();
    const router = useRouter();
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
    const [amenities, setAmenities] = useState([]); // AGORA VAI GUARDAR OBJETOS { value, label }
    const [imageGallery, setImageGallery] = useState([{ file: null, previewUrl: '' }]);
    const [provincias, setProvincias] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [selectedMunicipio, setSelectedMunicipio] = useState('');
    const [selectedBairro, setSelectedBairro] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    // LÓGICA DOS CAMPOS CONDICIONAIS
    const typesWithoutDetails = ['Terreno'];
    const areDetailsDisabled = typesWithoutDetails.includes(propertyType);
    
    // Lista de comodidades pré-definidas para sugestão
    const defaultAmenities = [
        { value: 'Garagem', label: 'Garagem' },
        { value: 'Quintal', label: 'Quintal' },
        { value: 'Piscina', label: 'Piscina' },
        { value: 'Ar Condicionado', label: 'Ar Condicionado' },
        { value: 'Cozinha Equipada', label: 'Cozinha Equipada' },
        { value: 'Varanda', label: 'Varanda' },
        { value: 'Segurança 24h', label: 'Segurança 24h' },
        { value: 'Elevador', label: 'Elevador' },
    ];

    // Efeito para limpar os campos desativados
    useEffect(() => {
        if (areDetailsDisabled) {
            setBeds('');
            setBaths('');
            setWidth('');
            setLength('');
            setAmenities([]); // Limpa também as comodidades
        }
    }, [propertyType]);

    // ... (Todos os outros useEffects e funções handle continuam iguais)
    useEffect(() => { if (status === 'unauthenticated') router.push('/login'); }, [status, router]);
    useEffect(() => { const fetchProvincias = async () => { const response = await fetch('/api/localizacoes/provincias'); const data = await response.json(); setProvincias(data); if (data.length > 0) setSelectedProvincia(data[0].id); }; fetchProvincias(); }, []);
    useEffect(() => { if (!selectedProvincia) return; const fetchMunicipios = async () => { const response = await fetch(`/api/localizacoes/municipios?provinciaId=${selectedProvincia}`); const data = await response.json(); setMunicipios(data); }; fetchMunicipios(); setSelectedMunicipio(''); setSelectedBairro(null); }, [selectedProvincia]);
    const handlePriceChange = (e) => { const rawValue = e.target.value.replace(/\D/g, ''); setPrice(rawValue); setDisplayPrice(new Intl.NumberFormat('de-DE').format(Number(rawValue) || 0)); };
    const handleImageChange = (index, file) => { const newGallery = [...imageGallery]; newGallery[index].file = file; newGallery[index].previewUrl = URL.createObjectURL(file); setImageGallery(newGallery); };
    const addImageSlot = () => setImageGallery([...imageGallery, { file: null, previewUrl: '' }]);
    const removeImageSlot = (index) => setImageGallery(imageGallery.filter((_, i) => i !== index));
    const loadBairros = async (inputValue) => { if (!selectedMunicipio) return []; const response = await fetch(`/api/localizacoes/bairros?municipioId=${selectedMunicipio}&query=${inputValue}`); const data = await response.json(); return data.map(bairro => ({ value: bairro.id, label: bairro.nome })); };
    const handleCreateBairro = async (inputValue) => { if (!selectedMunicipio) return toast.error("Selecione um município primeiro."); const newBairroName = inputValue.trim(); if (!newBairroName) return; const creationPromise = fetch('/api/localizacoes/bairros', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: newBairroName, municipioId: selectedMunicipio }) }).then(async (response) => { if (!response.ok) throw new Error("Falha ao criar bairro."); return response.json(); }); toast.promise(creationPromise, { loading: `A criar novo bairro "${newBairroName}"...`, success: (novoBairro) => { const newOption = { value: novoBairro.id, label: novoBairro.nome }; setSelectedBairro(newOption); return `Bairro "${novoBairro.nome}" criado e selecionado!`; }, error: "Falha ao criar o novo bairro." }); };

    // FUNÇÃO handleSubmit ATUALIZADA
    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... (validações como antes)
        
        setSubmitting(true);
        const formData = new FormData();
        const propertyData = {
            title, listingType, propertyType, price, beds, baths, width, length, description,
            amenities: amenities.map(a => a.value), // <-- Transforma de volta para um array de strings
            bairroId: selectedBairro.value,
        };
        // ... (resto da função handleSubmit com toast.promise)
        formData.append('data', JSON.stringify(propertyData));
        imageGallery.forEach(img => { if (img.file) formData.append('images', img.file) });
        const submissionPromise = fetch('/api/imoveis', { method: 'POST', body: formData }).then(async (response) => { if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Falha ao cadastrar imóvel.'); } return response.json(); });
        await toast.promise(submissionPromise, { loading: 'A publicar o seu anúncio...', success: () => { router.push('/'); return 'Anúncio publicado com sucesso!'; }, error: (err) => err.message, });
        setSubmitting(false);
    };

    if (status === 'loading') { return <div className="flex items-center justify-center min-h-screen"><LoaderCircle className="animate-spin h-10 w-10 text-purple-600" /></div>; }

    // O JSX DO FORMULÁRIO (COM AS SECÇÕES CONDICIONAIS)
    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* ... (cabeçalho do formulário sem alterações) ... */}
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* ... (outras seções sem alterações) ... */}
                        <FormSection title="Tipo de Imóvel">
                            <SelectField icon={<Home size={20}/>} label="Tipo de Imóvel" value={propertyType} onChange={e => setPropertyType(e.target.value)} required>
                                <option value="" disabled>Selecione</option>
                                {['Apartamento', 'Vivenda', 'Moradia', 'Terreno', 'Loja', 'Armazém', 'Escritório', 'Quinta'].map(type => <option key={type} value={type}>{type}</option>)}
                            </SelectField>
                        </FormSection>
                        
                        {/* A secção "Detalhes do Imóvel" agora é condicional */}
                        {!areDetailsDisabled && (
                             <FormSection title="Detalhes do Imóvel">
                                 {/* ... (código dos InputFields para quartos, wc, etc. com a prop 'disabled' e 'required' condicional) ... */}
                             </FormSection>
                        )}

                        {/* A secção "Comodidades" também é condicional e agora usa CreatableSelect */}
                        {!areDetailsDisabled && (
                            <FormSection title="Comodidades">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Selecione ou adicione comodidades</label>
                                <CreatableSelect
                                    isMulti
                                    options={defaultAmenities}
                                    value={amenities}
                                    onChange={setAmenities}
                                    placeholder="Selecione ou digite para criar uma nova..."
                                    formatCreateLabel={(inputValue) => `Adicionar "${inputValue}"`}
                                />
                            </FormSection>
                        )}

                        {/* ... (resto do formulário, galeria de imagens e botão de submissão) ... */}
                    </form>
                </div>
            </main>
        </div>
    );
}