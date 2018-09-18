---
title: API
date: 2018-09-18
layout: post.html
permalink: /api
---

# Observations

## Path

```
/observations
```

## Parameters

* `nearby` (string, required): pair of coordinates separated by comma;
* `limit` (integer, optional, default = 5): number of positions to include in the response.

## Examples

Query positions nearby a pair of coordinates:

[/observations?nearby=-1.285400390625,8.233237111274565](http://nightlights.us-west-2.elasticbeanstalk.com/observations?nearby=-1.285400390625,8.233237111274565)

Increase number of returned positions:

[/observations?nearby=-1.285400390625,8.233237111274565&limit=10](http://nightlights.us-west-2.elasticbeanstalk.com/observations?nearby=-1.285400390625,8.233237111274565&limit=10)


## Responses

### Success 200

Returns a GeoJSON object containing features nearby passed coordinates. Each feature represents the center of a 15 arc-second cell scanned by [VIIRS](https://en.wikipedia.org/wiki/Visible_Infrared_Imaging_Radiometer_Suite). Feature properties have a `data` key, which is an array containing observation value `rade9` and timestamp `scanned_at`. 

`rade9` is VIIRS visible wavelength radiance value (unit = W/(cm^2 -sr)) multiplied by 10^9, final unit is nano watts per square centimeter per steradian nW/(cm^2 -sr).

Example response:

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -1.36992582,
          8.15081722
        ]
      },
      "properties": {
        "id": "s100451",
        "data": [
          {
            "rade9": 0.05272794,
            "scanned_at": "2012-04-23T02:04:00.000Z"
          },
          {
            "rade9": 0.24038182,
            "scanned_at": "2012-04-24T01:47:00.000Z"
          },
          {
            "rade9": 0.14193553,
            "scanned_at": "2012-04-29T01:50:00.000Z"
          },
          {
            "rade9": 0.61558354,
            "scanned_at": "2012-05-12T01:05:00.000Z"
          },
          {
            "rade9": -0.03179271,
            "scanned_at": "2012-05-27T01:27:00.000Z"
          },
          {
            "rade9": 0.35491008,
            "scanned_at": "2012-06-11T01:43:00.000Z"
          },
          {
            "rade9": 0.13056859,
            "scanned_at": "2012-06-12T01:26:00.000Z"
          },
          {
            "rade9": -0.04864002,
            "scanned_at": "2012-06-24T00:58:00.000Z"
          },
          {
            "rade9": -0.20773731,
            "scanned_at": "2012-07-17T02:07:00.000Z"
          }
      }
    }
    ]
}
```

### Errors (4xx, 5xx)

In case of error, the server will respond with a HTTP error status code and a JSON containing a `message` property describing the error. Examples:

```
HTTP/1.1 400 Bad request
{
    "message": "Invalid "limit" parameter, must be an integer lower or equal to 10."
}
```

```
HTTP/1.1 500 Internal error
{
    "message": "Internal error."
}
```