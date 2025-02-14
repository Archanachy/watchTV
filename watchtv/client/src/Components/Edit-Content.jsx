import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import '../Styles/Edit-Content.css';
import axios from '../api/axios';

function EditContent() {
    const navigate = useNavigate();
    const { contentId } = useParams();
    const location = useLocation();
    const [image, setImage] = useState(null);
    const [croppedArea, setCroppedArea] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionCount, setDescriptionCount] = useState(0);
    const [releasedDate, setReleasedDate] = useState(''); // expects "YYYY-MM-DD"
    const [duration, setDuration] = useState('');
    const [kind, setKind] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [isKindDropdownOpen, setIsKindDropdownOpen] = useState(false);
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const kindDropdownRef = useRef(null);
    const genreDropdownRef = useRef(null);
    const [loading, setLoading] = useState(false);  // Loading state for delete button

    const formatTitle = (title) => {
        if (!title) return '';
        return title
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
    };

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/genres`);
                setGenres(response.data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        const handleClickOutside = (event) => {
            if (kindDropdownRef.current && !kindDropdownRef.current.contains(event.target)) {
                setIsKindDropdownOpen(false);
            }
            if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
                setIsGenreDropdownOpen(false);
            }
        };

        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }

        fetchGenres();
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Fetch content details and set state
        const fetchContentDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/content/${contentId}`);
                const content = response.data;
                setTitle(content.title);
                setDescription(content.description);
                setDescriptionCount(content.description.length);
                setReleasedDate(new Date(content.released_date).toISOString().split('T')[0]);
                setDuration(content.duration_minutes);
                setKind([content.kind]);
                setSelectedGenres(content.genres.map(genre => genre.name));
                setImage(`${import.meta.env.VITE_API_URL}${content.image_path}`);
            } catch (error) {
                console.error('Error fetching content details:', error);
            }
        };

        fetchContentDetails();
    }, [contentId]);

    const handleFileUpload = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    }, []);

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        setDescriptionCount(e.target.value.length);
    };

    const handleGenreSelect = (genre) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((g) => g !== genre));
        } else if (selectedGenres.length < 3) {
            setSelectedGenres([...selectedGenres, genre]);
        }
        validateForm();
    };

    const handleKindSelect = (kindOption) => {
        if (kind.includes(kindOption)) {
            setKind(kind.filter((k) => k !== kindOption));
        } else {
            setKind([kindOption]);
        }
        setIsKindDropdownOpen(false);
        validateForm();
    };

    const toggleKindDropdown = () => {
        setIsKindDropdownOpen(!isKindDropdownOpen);
    };

    const toggleGenreDropdown = () => {
        setIsGenreDropdownOpen(!isGenreDropdownOpen);
    };

    const validateForm = () => {
        setIsFormValid(
            !!title &&
            description.length >= 10 &&
            description.length < 700 &&
            !!releasedDate &&
            !!duration &&
            kind.length > 0 &&
            selectedGenres.length > 0 &&
            selectedGenres.length <= 3
        );
    };

    useEffect(() => {
        validateForm();
    }, [title, description, releasedDate, duration, kind, selectedGenres]);

    const handleUpdate = async () => {
        if (!image) {
            alert('Please upload an image before saving.');
            return;
        }
    
        setUploading(true);
        try {
    
            // Fetch current content details for comparison
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/content/${contentId}`);
            const originalContent = response.data;
    
            // Prepare data with only changed fields
            const formData = new FormData();
    
            if (title !== originalContent.title) formData.append('title', title);
            if (description !== originalContent.description) formData.append('description', description);
    
            // Use the release date string as-is; no conversion is needed.
            const formattedDate = releasedDate || originalContent.released_date;
            formData.append('releasedDate', formattedDate);
    
            if (duration !== originalContent.duration_minutes) formData.append('duration', duration);
            if (kind[0] !== originalContent.kind) formData.append('kind', kind[0]);
            if (selectedGenres.join(',') !== originalContent.genres.map(g => g.name).join(',')) {
                formData.append('genres', selectedGenres.join(','));
            }
    
            // Only append image if it's changed
            if (image !== `${import.meta.env.VITE_API_URL}${originalContent.image_path}`) {
                const imgResponse = await fetch(image);
                const blob = await imgResponse.blob();
                const file = new File([blob], 'uploaded_image.jpg', { type: blob.type });
                formData.append('contentImage', file);
            }
    
            // Send the update request
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/content/${contentId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            alert('Content updated successfully!');
            navigate(`/content/${contentId}`);
        } catch (error) {
            alert(error.response?.data?.message || 'An error occurred while updating content.');
        } finally {
            setUploading(false);
        }
    };
    
    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this content?');
        if (!confirmDelete) return; // Exit if user cancels
    
        try {
            // Show a loading state (optional)
            setLoading(true);
    
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/content/${contentId}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            alert('Content deleted successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error deleting content:', error.response?.data || error.message);
            alert('Failed to delete content. Please try again.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };
    
    const handleCancel = () => {
        navigate(`/content/${contentId}`);
    };
    
    const aspectRatio = 200 / 250;

    return (
        <div className="edit-container">
            <div className="edit-form-container">
                <div className="edit-header-container">
                    <h1>Edit Content</h1>
                </div>
                <div className="edit-image-container">
                    {image ? (
                        <div className={`edit-crop-container ${image ? 'edit-image-uploaded' : ''}`}>
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspectRatio}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                style={{ containerStyle: { width: '100%', height: '100%' } }}
                            />
                            <button className="edit-remove-image-button" onClick={removeImage}>
                                ✖
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleFileUpload}>
                            <span>Upload Poster</span>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                        </button>
                    )}
                </div>
                <div className="edit-details-container">
                    <label>
                        <span className='edit-box-label'>Title:</span>
                        <input type="text" value={title} onChange={(e) => setTitle(formatTitle(e.target.value))} />
                    </label>
                    <label>
                        <span className='edit-box-label'>Description:</span>
                        <textarea
                            value={description}
                            onChange={handleDescriptionChange}
                            maxLength={700}
                            placeholder="Describe the content in 10-700 words"
                            onInput={(e) => setDescriptionCount(e.target.value.length)}
                        />
                        <div className='edit-description-count'>{descriptionCount}/700</div>
                    </label>
                    <label>
                        <span className='edit-box-label'>Release Date:</span>
                        <input
                            type="date"
                            value={releasedDate}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setReleasedDate(e.target.value)}
                        />
                    </label>
                    <label>
                        <span className='edit-box-label'>Duration (in min):</span>
                        <input
                            type="number"
                            min="15"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </label>
                    <label>
                        <span className='edit-box-label'>Kind:</span>
                        <div className="edit-custom-dropdown" ref={kindDropdownRef}>
                            <div className="edit-dropdown-header" onClick={toggleKindDropdown}>
                                {kind.length > 0 ? kind.join(', ') : 'Select Kind (movie or Tv/web series)'}
                                <span className="edit-dropdown-arrow">{isKindDropdownOpen ? '▲' : '▼'}</span>
                            </div>
                            {isKindDropdownOpen && (
                                <div className="edit-dropdown-options">
                                    <div
                                        className={`edit-dropdown-option ${kind.includes('Movie') ? 'selected' : ''}`}
                                        onClick={() => handleKindSelect('Movie')}
                                    >
                                        Movie
                                    </div>
                                    <div
                                        className={`edit-dropdown-option ${kind.includes('Show') ? 'selected' : ''}`}
                                        onClick={() => handleKindSelect('Show')}
                                    >
                                        Show
                                    </div>
                                </div>
                            )}
                        </div>
                    </label>
                    <label>
                        <span className='edit-box-label'>Genres:</span>
                        <div className="edit-custom-dropdown" ref={genreDropdownRef}>
                            <div className="edit-dropdown-header" onClick={toggleGenreDropdown}>
                                {selectedGenres.length > 0 ? (
                                    selectedGenres.map((genre) => (
                                        <div key={genre} className="edit-selected-genre">
                                            {genre}
                                            <span className="edit-remove-genre" onClick={(e) => { e.stopPropagation(); handleGenreSelect(genre); }}>✖</span>
                                        </div>
                                    ))
                                ) : (
                                    'Max 3 genres'
                                )}
                                <span className="edit-dropdown-arrow">{isGenreDropdownOpen ? '▲' : '▼'}</span>
                            </div>
                            {isGenreDropdownOpen && (
                                <div className="edit-dropdown-options">
                                    {genres.length > 0 ? (
                                        genres.map((genre) => (
                                            <div
                                                key={genre.genre_id}
                                                className={`edit-dropdown-option ${selectedGenres.includes(genre.name) ? 'selected' : ''}`}
                                                onClick={() => handleGenreSelect(genre.name)}
                                            >
                                                {genre.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="edit-dropdown-option">No genres available</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </label>
                </div>
                <div className="edit-controls-container">
                    <button id='edit-update' onClick={handleUpdate}>
                        Update
                    </button>
                    <button id='edit-delete' onClick={handleDelete}>
                        Delete
                    </button>
                    <button id='edit-cancel' onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditContent;
