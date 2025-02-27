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
            font-family: Arial, Helvetica, sans-serif
        }
        .page {
            /* Your content styles go here */
          
        }
    </style>
</head>
<body>
<div class="page">
    <div style="font-size:12px; margin-bottom: 20px;">
        <div style="float: right;">Accomplish in 3 copies</div>
        <div>NAP Form No.3</div>
        <div>Revised 2012</div>
    </div>
    <div>
        <table style="width: 100%; border: 1px solid #000; padding: 0px !important;" cellspacing=0>
            <thead>
                <tr>
                    <th colspan="4" style="padding: 0px !important; border-bottom: 1px solid #000;">
                        <table style="width: 100%;" cellspacing="0">
                            <tr>
                                <th rowspan="2" style="border-right: 1px solid #000;border-bottom: 1px solid #000;">
                                    <div>NATIONAL ARCHIVES OF THE PHILIPPINES</div>
                                    <div style="margin-bottom: 20px">Pambansang Sinupan ng Pilipinas</div>
                                    <div>REQUEST FOR AUTHORITY TO DISPOSE <br />
                                        OF RECORDS</div>
                                </th>
                                <th style="border-bottom: 1px solid #000; text-align: left;">
                                    <div>AGENCY NAME:</div>
                                </th>
                            </tr>
                            <tr>
                                <th style="border-bottom: 1px solid #000; text-align: left;">ADDRESS:</th>
                            </tr>
                            <tr>
                                <th style="border-right: 1px solid #000; height: 15mm; text-align: left;">
                                    <div>DATE:</div>
                                </th>
                                <th style="text-align: left">TELEPHONE NUMBER:</th>
                            </tr>
                        </table>


                    </th>
                </tr>
                <tr style="border-bottom: 1px solid #000;" >    
                    <th style="width: 10%; border-bottom: 1px solid #000; border-right: 1px solid #000; ">GRDS/RDS ITEM NO.</th>
                    <th style="width: 45%; border-bottom: 1px solid #000; border-right: 1px solid #000;">RECORD SERIES TITLE AND DESCRIPTION</th>
                    <th style="width: 20%;border-bottom: 1px solid #000; border-right: 1px solid #000;">PERIOD COVERED</th>
                    <th style="width: 25%;border-bottom: 1px solid #000; ">RETENTION PERIOD
                        AND PROVISION/S
                        COMPLIED (If Any)</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($rds as $r)
                    @foreach ($r->documents as $doc)
                    <tr>
                        <td style="border-right: 1px solid #000">{{$doc->rds->item_number}}</td>
                        <td style="border-right: 1px solid #000">
                            {{$doc->rds->record_series_title_and_description}}
                            <pre>
                                {{$doc->rds->record_series_title_and_description_1}}
                            </pre>
    
                        </td>
                        <td style="border-right: 1px solid #000">
                            {{$doc->period_covered_from}} to {{$doc->period_covered_to}}
                        </td >
                        <td tyle="border-right: 1px solid #000">{{$doc->rds->remarks}}</td>
                    </tr>
                    @endforeach
                @endforeach
                @for ($i = 0; $i < 20-$rds->count(); $i++)
                <tr >
                    <td style="border-right: 1px solid #000"></td>
                    <td style="border-right: 1px solid #000; color: #fff;">-</td>
                    <td style="border-right: 1px solid #000"></td>
                    <td></td>
                </tr>
                @endfor
           
            </tbody>
            <tfoot>
                <tr>
                    
                    <td colspan="2" style=" border-top: 1px solid #000; border-right: 1px solid #000;"> 
                        <div>LOCATION OF RECORDS:</div> 
                    </td>
                    <td colspan="2" style="border-top: 1px solid #000;">
                        <div>VOLUME IN CUBIC METER:</div>
                    </td>
                </tr>
                <tr>
                    
                    <td colspan="2"style="border-top: 1px solid #000;border-right: 1px solid #000;"> 
                        <div>PREPARED BY: (Name & Signature)</div> 
                    </td>
                    <td colspan="2"style="border-top: 1px solid #000;">
                        <div>POSITION:</div>
                    </td>
                </tr>
                <tr>
                    
                
                    <td colspan="4"style="border-top: 1px solid #000; " align="center" >
                        <div>CERTIFIED AND APPROVED BY:</div>
                        <div style="margin-bottom: 20px">This is to certify that the above mentioned records are no longer needed and <br/>
                            not involved nor connected in any administrative or judicial cases.</div>
                         <div style="text-align: right; text-decoration: overline;" >Name and Signature of Agency Head
                        </div>
                        <div style="text-align: right">
                            or Duly Authorized Representative
                        </div>
                    </td>
                </tr>
                
            </tfoot>

            
        </table>
    </div>


</div>
</body>
</html>