<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @page {
            size: 29.7cm 21cm; /* A4 size */
            margin: 0.39in 0.39in 0.39in 0.39in; /* Adjust margins as needed */
        }
        body {
            font-family: 'Verdana';
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* Ensure the body takes up the full viewport height */
        }
        .page {
            /* Your content styles go here */
            text-align: center;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="page">

        
        <div style="font-size: 48pt; padding-top: 0.2rem; padding-bottom: 0.2rem; border: 1px solid #000; width: calc(100% - 1px); float: right; font-weight: bold;">{{ $rds_record->branch->name }}</div>
        <div style="font-size: 148pt; margin-bottom: 1rem; padding-top: 1rem; padding-bottom: 1rem; border: 1px solid #000; width: calc(100% - 1px); float: right; font-weight: bold;">{{ $rds_record->box_number }}</div>
        <div style="font-size: 38pt; padding-top: 0.2rem; padding-bottom: 0.2rem; border: 1px solid #000; width: calc(100% - 1px); float: right; font-weight: bold;">DISPOSAL DATE: {{ date('F j, Y', strtotime($rds_record->documents[0]->projected_date_of_disposal)) }}</div>
    </div>
    <script defer>
        window.onload = function() {
            window.print();
        }
    </script>
</body>
</html>
