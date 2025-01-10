import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import '../Styles/Upload.css';

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
    const [kind, setKind] = useState('');
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const availableGenres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Thriller'];
        setGenres(availableGenres);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const validateForm = () => {
        setIsFormValid(
            !!title &&
            !!description &&
            !!releasedDate &&
            !!duration &&
            !!kind &&
            selectedGenres.length > 0 &&
            selectedGenres.length <= 3
        );
    };

    const handleSave = async () => {
        setUploading(true);
        try {
            console.log('Saving data...');
        } catch (error) {
            console.error(error);
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
                        <span>Title:</span>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </label>
                    <label>
                        <span>Description:</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <label>
                        <span>Release Date:</span>
                        <input
                            type="date"
                            value={releasedDate}
                            onChange={(e) => setReleasedDate(e.target.value)}
                        />
                    </label>
                    <label>
                        <span>Duration (in min):</span>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </label>
                    <label>
                        <span>Kind:</span>
                        <select value={kind} onChange={(e) => setKind(e.target.value)}>
                            <option value="" disabled>
                                Select Kind
                            </option>
                            <option value="Tv/Shows">Shows</option>
                            <option value="Movies">Movies</option>
                        </select>
                    </label>
                    <label>
                        <span>Genres:</span>
                        <div className="custom-dropdown" ref={dropdownRef}>
                            <div className="dropdown-header" onClick={toggleDropdown}>
                                {selectedGenres.length > 0
                                    ? selectedGenres.join(', ')
                                    : 'Select up to 3 genres'}
                                <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
                            </div>
                            {isDropdownOpen && (
                                <div className="dropdown-options">
                                    {genres.map((genre) => (
                                        <div
                                            key={genre}
                                            className={`dropdown-option ${
                                                selectedGenres.includes(genre) ? 'selected' : ''
                                            }`}
                                            onClick={() => handleGenreSelect(genre)}
                                        >
                                            {genre}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </label>
                </div>
                <div className="upload-controls-container">
                    <button onClick={handleSave} disabled={!isFormValid || uploading}>
                        Save
                    </button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default Upload;