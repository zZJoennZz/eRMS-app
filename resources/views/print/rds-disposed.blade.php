<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        @page {
            size: 21cm 29.7cm; /* A4 size */
            margin: 0.39in 0.39in 0.39in 0.39in; /* Adjust margins as needed */

        }
        body {
           /* Ensure the body takes up the full viewport height */

        }
        .page {
            /* Your content styles go here */
          
        }
    </style>
</head>
<body>
<div class="page">
    <div style="font-size:12px; margin-bottom: 20px;">
        <div style="float: right; font-weight: bold; font-style: italic; font-size: 20px;">CLASS D</div>
        eRMS Report
        <div style="font-size: 20px; font-weight: bold; text-align: center; margin-top: 40px;">SUMMARY OF DISPOSED RECORDS</div>
    </div>
    <div>
        <table style="width: 100%; border: 1px solid #000; padding: 0px !important;" cellspacing=0>
            <thead>
                <tr>
                    <th colspan="4" style="padding: 0px !important; border-bottom: 1px solid #000;">
                        <table style="width: 100%;" cellspacing="0">
                            <tr>
                                <th style="border-right: 1px solid #000; width: 25%;">
                                    RDS
                                </th>
                                <th style="border-right: 1px solid #000; width: 35%;">
                                    DOCUMENTS
                                </th>
                                <th style="border-right: 1px solid #000; width: 20%;">
                                    PERIOD
                                </th>
                                <th style=" border-right: 1px solid #000; width: 20%;" >
                                    DATE DISPOSED
                                </th>
                            </tr>
                        </table>
                    </th>
                </tr>
            </thead>
            <tbody style="width: 100%">
                @for ($i = 0; $i < 20; $i++)
                <tr>
                    <td style="border-right: 1px solid #000; width: 25%;">RDS NUMBER</td>
                    <td style="border-right: 1px solid #000; width: 35%;">Document title</td>
                    <td style="border-right: 1px solid #000; width: 20%;">Period</td>
                    <td style="border-right: 1px solid #000; width: 20%;">date disposed</td>
                </tr>
                @endfor
            </tbody>
            
        </table>
        <tfoot>
           <div style="margin-top: 30mm; text-decoration-line: overline;">
            Prepared By:
            </div> 
        </tfoot>
    </div>
</div>
</body>
</html>