import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import '../Styles/Upload.css';
import axios from '../api/axios';

function Upload() {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [croppedArea, setCroppedArea] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [releasedDate, setReleasedDate] = useState('');
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

    const formatTitle = (title) => {
        if (!title) return '';
        return title
          .split(' ') // Split into words
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter
          .join(' '); // Rejoin words
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
            setKind([kindOption]); // Only allow one kind to be selected
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
            !!description &&
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

    const handleSave = async () => {
        if (!image) {
            alert('Please upload an image before saving.');
            return;
        }

        setUploading(true);
        try {
            // Create FormData for the image and other fields
            const formData = new FormData();
            const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

            // Append all form data
            formData.append('userId', userId);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('releasedDate', releasedDate);
            formData.append('duration', duration);
            formData.append('kind', kind[0]);
            formData.append('genres', selectedGenres.join(','));

            // Convert the cropped image to a file and append
            if (image) {
                const response = await fetch(image);
                const blob = await response.blob();
                const file = new File([blob], 'uploaded_image.jpg', { type: blob.type });
                formData.append('contentImage', file);
            }

            // Send the form data to the server
            await axios.post(`${import.meta.env.VITE_API_URL}/api/content`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is stored
                },
            });

            alert('Content uploaded successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error uploading content:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message); // Display server error message
            } else {
                alert('An error occurred while uploading content. Please try again.');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    const aspectRatio = 200 / 250;

    return (
        <div className="upload-container">
            <div className="upload-form-container">
                <div className="upload-header-container">
                    <h1>Upload Content</h1>
                </div>
                <div className="upload-image-container">
                    {image ? (
                        <div className={`crop-container ${image ? 'image-uploaded' : ''}`}>
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
                            <button className="remove-image-button" onClick={removeImage}>
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
                <div className="upload-details-container">
                    <label>
                        <span className='box-label'>Title:</span>
                        <input type="text" value={title} onChange={(e) => setTitle(formatTitle(e.target.value))} />
                    </label>
                    <label>
                        <span className='box-label'>Description:</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <label>
                        <span className='box-label'>Release Date:</span>
                        <input
                            type="date"
                            value={releasedDate}
                            onChange={(e) => setReleasedDate(e.target.value)}
                        />
                    </label>
                    <label>
                        <span className='box-label'>Duration (in min):</span>
                        <input
                            type="number"
                            min="15"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </label>
                    <label>
                        <span className='box-label'>Kind:</span>
                        <div className="custom-dropdown" ref={kindDropdownRef}>
                            <div className="dropdown-header" onClick={toggleKindDropdown}>
                                {kind.length > 0 ? kind.join(', ') : 'Select Kind (movie or Tv/web series)'}
                                <span className="dropdown-arrow">{isKindDropdownOpen ? '▲' : '▼'}</span>
                            </div>
                            {isKindDropdownOpen && (
                                <div className="dropdown-options">
                                    <div
                                        className={`dropdown-option ${kind.includes('Show') ? 'selected' : ''}`}
                                        onClick={() => handleKindSelect('Show')}
                                    >
                                        Show
                                    </div>
                                    <div
                                        className={`dropdown-option ${kind.includes('Movie') ? 'selected' : ''}`}
                                        onClick={() => handleKindSelect('Movie')}
                                    >
                                        Movie
                                    </div>
                                </div>
                            )}
                        </div>
                    </label>
                    <label>
                        <span className='box-label'>Genres:</span>
                        <div className="custom-dropdown" ref={genreDropdownRef}>
                            <div className="dropdown-header" onClick={toggleGenreDropdown}>
                                {selectedGenres.length > 0 ? (
                                    selectedGenres.map((genre) => (
                                        <div key={genre} className="selected-genre">
                                            {genre}
                                            <span className="remove-genre" onClick={(e) => { e.stopPropagation(); handleGenreSelect(genre); }}>✖</span>
                                        </div>
                                    ))
                                ) : (
                                    'Max 3 genres'
                                )}
                                <span className="dropdown-arrow">{isGenreDropdownOpen ? '▲' : '▼'}</span>
                            </div>
                            {isGenreDropdownOpen && (
                                <div className="dropdown-options">
                                    {genres.length > 0 ? (
                                        genres.map((genre) => (
                                            <div
                                                key={genre.genre_id}
                                                className={`dropdown-option ${selectedGenres.includes(genre.name) ? 'selected' : ''}`}
                                                onClick={() => handleGenreSelect(genre.name)}
                                            >
                                                {genre.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="dropdown-option">No genres available</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </label>
                </div>
                <div className="upload-controls-container">
                    <button id='save' onClick={handleSave} disabled={!isFormValid || uploading}>
                        Save
                    </button>
                    <button id='cancel' onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Upload;