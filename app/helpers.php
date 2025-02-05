<?php
//responses


if (!function_exists('send400Response')) {
    function send400Response(string $custom_message = null)
    {
        return response()->json([
            'success' => false,
            'message' => $custom_message ?? 'Unhandled error! Please contact the web developer.',
        ], 400);
    }
}
if (!function_exists('send200Response')) {
    function send200Response($arr = [], string $custom_message = null)
    {
        return response()->json([
            'success' => true,
            'message' => $custom_message ?? 'Action success.',
            'data' => $arr,
        ], 200);
    }
}
if (!function_exists('send401Response')) {
    function send401Response()
    {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized access.'
        ], 401);
    }
}
if (!function_exists('send404Response')) {
    function send404Response($resource = null)
    {
        return response()->json([
            'success' => false,
            'message' => $resource ?? 'Resource not found.'
        ], 404);
    }
}
if (!function_exists('send422Response')) {
    function send422Response($msg = null)
    {
        return response()->json([
            'success' => false,
            'message' => $msg ?? 'Input validation failed.'
        ], 422);
    }
}
