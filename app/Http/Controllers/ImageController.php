<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Cache;

class ImageController extends Controller
{
    /**
     * Serve an optimized image
     *
     * @param Request $request
     * @param string $path
     * @return mixed
     */
    public function serve(Request $request, $path = null)
    {
        // Determine the full path to the image
        $path = str_replace('..', '', $path); // Prevent directory traversal
        $imagePath = public_path($path);
        
        // Check if the image exists
        if (!file_exists($imagePath)) {
            abort(404);
        }
        
        // Get image info
        $extension = pathinfo($imagePath, PATHINFO_EXTENSION);
        $quality = $request->query('q', 85);
        $width = $request->query('w', null);
        
        // Create a cache key for this specific version of the image
        $cacheKey = md5($path . $quality . $width . filemtime($imagePath));
        
        // Set cache path
        $cachePath = public_path('assets/optimized/' . $cacheKey . '.' . $extension);
        
        // If the image is not cached, create it
        if (!file_exists($cachePath)) {
            // Create the optimized directory if it doesn't exist
            if (!file_exists(dirname($cachePath))) {
                File::makeDirectory(dirname($cachePath), 0755, true, true);
            }
            
            // Get image content
            $imageContent = file_get_contents($imagePath);
            
            // Process the image
            if (in_array(strtolower($extension), ['jpg', 'jpeg', 'png'])) {
                // Only process images we know we can handle
                $image = imagecreatefromstring($imageContent);
                
                if ($image !== false) {
                    // Resize if width is specified
                    if ($width !== null) {
                        $originalWidth = imagesx($image);
                        $originalHeight = imagesy($image);
                        $ratio = $originalHeight / $originalWidth;
                        $newHeight = intval($width * $ratio);
                        
                        $resized = imagecreatetruecolor($width, $newHeight);
                        
                        // Handle transparency for PNG
                        if (strtolower($extension) === 'png') {
                            imagealphablending($resized, false);
                            imagesavealpha($resized, true);
                            $transparent = imagecolorallocatealpha($resized, 255, 255, 255, 127);
                            imagefilledrectangle($resized, 0, 0, $width, $newHeight, $transparent);
                        }
                        
                        imagecopyresampled($resized, $image, 0, 0, 0, 0, $width, $newHeight, $originalWidth, $originalHeight);
                        $image = $resized;
                    }
                    
                    // Save the optimized image
                    if (strtolower($extension) === 'png') {
                        imagepng($image, $cachePath, 9); // 0-9, 9 is max compression
                    } else {
                        imagejpeg($image, $cachePath, $quality);
                    }
                    
                    imagedestroy($image);
                } else {
                    // If we couldn't process the image, just save the original
                    file_put_contents($cachePath, $imageContent);
                }
            } else {
                // For unsupported image types, just copy the original
                file_put_contents($cachePath, $imageContent);
            }
        }
        
        // Get the file mime type
        $mime = '';
        switch (strtolower($extension)) {
            case 'jpg':
            case 'jpeg':
                $mime = 'image/jpeg';
                break;
            case 'png':
                $mime = 'image/png';
                break;
            case 'gif':
                $mime = 'image/gif';
                break;
            case 'webp':
                $mime = 'image/webp';
                break;
            default:
                $mime = 'application/octet-stream';
        }
        
        // Return the image with appropriate headers
        return Response::file($cachePath, [
            'Content-Type' => $mime,
            'Cache-Control' => 'public, max-age=31536000',
            'Expires' => gmdate('D, d M Y H:i:s \G\M\T', time() + 31536000),
        ]);
    }
} 