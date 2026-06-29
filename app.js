// Biotren App - Cleaned and Deobfuscated JS
const a0_0x3891 = () => "";
const a0_0x21a539 = () => "";

function getFechaLocal(_0x26b599 = new Date()) {
  const _0x5a4713 = a0_0x3891,
    _0xbbc17f = {
      iSajx: function (_0x13611f, _0x36aef2) {
        return _0x13611f + _0x36aef2;
      },
      Pcrmr: function (_0xa95bac, _0xf6119c) {
        return _0xa95bac(_0xf6119c);
      },
    },
    _0x35fe82 = _0x26b599["getFullYear"](),
    _0x413161 = String(_0xbbc17f["iSajx"](_0x26b599["getMonth"](), 0x1))[
      "padStart"
    ](0x2, "0"),
    _0x566da0 = _0xbbc17f["Pcrmr"](String, _0x26b599["getDate"]())["padStart"](
      0x2,
      "0",
    );
  return _0x35fe82 + "-" + _0x413161 + "-" + _0x566da0;
}
let baseDatos = null;
function getTipoUsuario() {
  const _0x50b76e = a0_0x3891,
    _0x39e870 = { kicCX: "general" };
  return localStorage["getItem"]("tipoUsuario") || _0x39e870["kicCX"];
}
function setTipoUsuario(_0x347bbd) {
  const _0x3f4993 = a0_0x3891;
  localStorage["setItem"]("tipoUsuario", _0x347bbd);
}
let _hayInternet = ![];
async function verificarConectividadReal(_0x5d3dec = 0x7d0) {
  const _0x3f0399 = a0_0x3891,
    _0xd8f76f = {
      iLdVK: function (_0x689be3, _0x59ef07, _0x103f88) {
        return _0x689be3(_0x59ef07, _0x103f88);
      },
      RGGvM: function (_0x12e15b, _0x275e35) {
        return _0x12e15b + _0x275e35;
      },
      ZrWqj: "HEAD",
      HkyjB: "no-cors",
      QYZDs: "no-store",
      lwwMx: function (_0x5e2ffd, _0x1353de) {
        return _0x5e2ffd(_0x1353de);
      },
    },
    _0x256647 = new AbortController(),
    _0x3b987b = _0xd8f76f["iLdVK"](
      setTimeout,
      () => _0x256647["abort"](),
      _0x5d3dec,
    );
  try {
    return (
      await _0xd8f76f["iLdVK"](
        fetch,
        _0xd8f76f["RGGvM"](
          "https://www.gstatic.com/generate_204?_=",
          Date["now"](),
        ),
        {
          method: _0xd8f76f["ZrWqj"],
          mode: _0xd8f76f["HkyjB"],
          cache: _0xd8f76f["QYZDs"],
          signal: _0x256647["signal"],
        },
      ),
      _0xd8f76f["lwwMx"](clearTimeout, _0x3b987b),
      !![]
    );
  } catch {
    return (clearTimeout(_0x3b987b), ![]);
  }
}
function actualizarIndicadorConexion(_0x13fbbf) {
  const _0x4dabf8 = a0_0x3891,
    _0x3fd2aa = {
      mFwvx: "conexion-dot",
      mwUrW: function (_0x390d2e, _0x26fee6) {
        return _0x390d2e === _0x26fee6;
      },
      dUJbl: "online",
      BjNPM: "#22c55e",
      zjBkd: "#ef4444",
    },
    _0x29f237 = document["getElementById"](_0x3fd2aa["mFwvx"]);
  if (!_0x29f237) return;
  ((_0x29f237["style"]["background"] = _0x3fd2aa["mwUrW"](
    _0x13fbbf,
    _0x3fd2aa["dUJbl"],
  )
    ? _0x3fd2aa["BjNPM"]
    : _0x3fd2aa["zjBkd"]),
    (_hayInternet = _0x13fbbf === _0x3fd2aa["dUJbl"]));
}
async function fetchConTimeout(_0x52e00d, _0x4acdc0 = 0xbb8) {
  const _0x32bf4a = a0_0x3891,
    _0x1317ae = {
      ypebn: function (_0x472ff0, _0x22b21, _0x3556e5) {
        return _0x472ff0(_0x22b21, _0x3556e5);
      },
      cHwjY: "undefined",
      iLiuc: function (_0x170e0e, _0x5cf420) {
        return _0x170e0e(_0x5cf420);
      },
    },
    _0x2f5df7 = new AbortController(),
    _0x23428f = _0x1317ae["ypebn"](
      setTimeout,
      () => _0x2f5df7["abort"](),
      _0x4acdc0,
    );
  try {
    const _0x227b77 = await fetch(_0x52e00d + "?v=" + Date["now"](), {
      signal: _0x2f5df7["signal"],
      cache: "no-store",
      headers: {
        "x-biotren-client":
          typeof BIOTREN_TOKEN !== _0x1317ae["cHwjY"] ? BIOTREN_TOKEN : "",
      },
    });
    clearTimeout(_0x23428f);
    if (!_0x227b77["ok"]) throw new Error("HTTP " + _0x227b77["status"]);
    return await _0x227b77["json"]();
  } catch (_0x30dbc6) {
    _0x1317ae["iLiuc"](clearTimeout, _0x23428f);
    throw _0x30dbc6;
  }
}
async function cargarDatos() {
  const _0x53eab2 = a0_0x3891,
    _0x20f576 = {
      WdDOt: "resultados-container",
      RPwXZ: "baseDatos",
      XYnFH: function (_0x1ef865, _0x1e8892) {
        return _0x1ef865(_0x1e8892);
      },
      ZxZOA: "offline",
      pVUxs: "version.json",
      MpbvB: function (_0xeb844e, _0x220d31) {
        return _0xeb844e === _0x220d31;
      },
      WgWDE: "✅ Horarios actualizados desde el servidor",
      KUAKZ: function (_0x208ce6, _0x213548) {
        return _0x208ce6 === _0x213548;
      },
      QwssF: "AbortError",
      zqQPb: "⚠️ Error de red. Usando datos locales...",
      sWhFV:
        "<p class='no-data'>Primera vez: necesitas internet para descargar los horarios.</p>",
    },
    _0x13e47b = document["getElementById"](_0x20f576["WdDOt"]),
    _0x545907 = localStorage["getItem"](_0x20f576["RPwXZ"]);
  if (_0x545907)
    try {
      ((baseDatos = JSON["parse"](_0x545907)),
        console["log"](
          "💾\x20Datos\x20locales\x20cargados\x20—\x20app\x20lista\x20offline",
        ));
    } catch {
      localStorage["removeItem"]("baseDatos");
    }
  const _0x3207c7 = await _0x20f576["XYnFH"](verificarConectividadReal, 0x7d0);
  if (!_0x3207c7) {
    (console["warn"]("📵 Sin internet detectado por ping"),
      actualizarIndicadorConexion(_0x20f576["ZxZOA"]));
    if (!baseDatos) {
      _0x13e47b["innerHTML"] =
        "<p class='no-data'>Primera vez: necesitas internet para descargar los horarios.</p>";
      throw new Error("Sin internet y sin datos locales");
    }
    return;
  }
  ((_hayInternet = !![]),
    _0x20f576["XYnFH"](actualizarIndicadorConexion, "online"));
  try {
    const { ultima_update: _0x1968bb } = await fetchConTimeout(
        _0x20f576["pVUxs"],
        0xbb8,
      ),
      _0x3f78dc = localStorage["getItem"]("ultima_update");
    if (_0x20f576["MpbvB"](_0x1968bb, _0x3f78dc)) {
      console["log"]("✅\x20Horarios\x20en\x20caché\x20vigentes");
      return;
    }
    console["log"]("🔄 Nueva versión detectada, descargando horarios...");
    const _0xb88ede = await fetchConTimeout("horarios.json", 0x2710);
    ((baseDatos = _0xb88ede),
      localStorage["setItem"]("baseDatos", JSON["stringify"](_0xb88ede)),
      localStorage["setItem"]("ultima_update", _0x1968bb),
      console["log"](_0x20f576["WgWDE"]));
  } catch (_0x5171d1) {
    const _0x53e521 = _0x20f576["KUAKZ"](_0x5171d1["name"], _0x20f576["QwssF"]);
    console["warn"](
      _0x53e521
        ? "⚠️\x20Timeout\x20al\x20verificar\x20versión.\x20Usando\x20datos\x20locales..."
        : _0x20f576["zqQPb"],
    );
    if (!baseDatos) {
      _0x13e47b["innerHTML"] = _0x20f576["sWhFV"];
      throw _0x5171d1;
    }
  }
}
function iniciarMonitoreoConexion() {
  const _0x51ce3b = a0_0x3891,
    _0x309b31 = {
      FcPkW: function (_0x288595, _0x5aa249) {
        return _0x288595(_0x5aa249);
      },
      hyGeM: function (_0x105b76, _0xe3aceb) {
        return _0x105b76 && _0xe3aceb;
      },
      LgHtp: function (_0x5d0db7, _0x6de2d2) {
        return _0x5d0db7(_0x6de2d2);
      },
      uNDvX: "online",
      SIpdw: "offline",
      nCmcP: function (_0x51e966, _0x487788, _0x4c3c93) {
        return _0x51e966(_0x487788, _0x4c3c93);
      },
    };
  async function _0x1d19e6() {
    const _0x3d2078 = _0x51ce3b,
      _0x217ce3 = _hayInternet,
      _0x44c554 = await _0x309b31["FcPkW"](verificarConectividadReal, 0x7d0);
    if (_0x309b31["hyGeM"](!_0x217ce3, _0x44c554))
      (console["log"]("🌐 Conexión recuperada, sincronizando..."),
        _0x309b31["LgHtp"](actualizarIndicadorConexion, _0x309b31["uNDvX"]),
        cargarDatos()["catch"](() => {}));
    else
      _0x309b31["hyGeM"](_0x217ce3, !_0x44c554) &&
        actualizarIndicadorConexion(_0x309b31["SIpdw"]);
    _hayInternet = _0x44c554;
  }
  (_0x309b31["nCmcP"](setInterval, _0x1d19e6, 0x7530),
    window["addEventListener"]("online", () => _0x1d19e6()),
    window["addEventListener"]("offline", () =>
      actualizarIndicadorConexion("offline"),
    ));
}
function a0_0x3516() {
  const _0x52dd12 = [
    "lYa6WQel",
    "e8kQufVcVrZcTwe5WPe7C8k4iZlcKq",
    "fuHaAI/dRSkZWPy",
    "WQtdQmovW6jG",
    "4P6ABYJcNxddOSoAyMddVGH0WRddK0rQAX4jjdCWu8o1krS",
    "8jk6Gs7dI2e/amkOtCkpWODdW7a+c1ieW5C",
    "WRVcKmkDWQVcLmo9lCkGB8keWQldGSkE",
    "WRHwWOuOzv5/W5ZdQSoSWPq9uG",
    "vf5GW5P/jbBcPK/dHCoEFSoEfu92jq",
    "WQdcK8khWQC",
    "W7tdTZ5KW68",
    "tSogWPxdLqpdPa",
    "WR4lCSoNbKRcOWj0tCkgsSotWQ47E0ldTND2DqmPW5jTqe7cOCopW5jjW4BcOmkleCoJqCoZtCk7iJBdHIaxnmoDWRiLrNboWO3cPe5pWQVcVI/cHSknW5rBFSogk2fGW7CJW7W4zNejzmkzzxm",
    "W5D5WRxcVNO8WReQW5xcUtNdJSoo",
    "smoLWRddVSoqWO3cTCkctvZcPeLrca",
    "WR/dGmkWW4StvCkuWOeyf8oCcYiEW49u",
    "gSogWPBcPrevyqPXWQJcOslcMSk1xCkk",
    "wMdcJSoIWPG",
    "W5pcNsjiW7q",
    "haRdRSo8W7WlW6G",
    "dmoBW4NdOu0",
    "kSkxwLJcGW",
    "W5xcMYvK",
    "WRPAWOqGzLz1W4S",
    "k8onW4ZdGcG",
    "tCokWPldSaddSCkNW4O",
    "W6K1WQqecSkf",
    "W73dGCkMFmkSw3ZcTN9/W5xdMhm",
    "rqfdrNldQW",
    "i8oQW7pdLb8Pya",
    "bmkLababmuC7W5ZdJqu",
    "rarEuW",
    "FMfbFSol",
    "WPjuWR81Da",
    "CGPYCeq",
    "WQJdHCk4W7Sa",
    "qCogW7fiWPtdRuHHWOu",
    "WQRcN8oZoSoR",
    "EJ52WQ1p",
    "wK9GWPbMiW",
    "gN/dTSokyG",
    "WQHwWOuYBCojFSkvWPu",
    "W67dJGLQW5BdKq",
    "gSoJWR7dT8ol",
    "W7xcUCkbt8ke",
    "cvXiWR5/W6/cPvy",
    "W6RcVmkv",
    "vvxcQSoJWQtdQfS7WOznA8kJ",
    "WR8kamk1qW",
    "WRhdOSolW757W6VcTa",
    "8lkJTqjfWObEWP9ij8ouWReJWOddL1r9fSk2pef0WOFcMr9Yumokr23dJH4VWRqT",
    "W44OW6e",
    "W7VdT8kzW65+W6xcQx9Dm8kvrmoyjmktWRZcMCk8WPTImcBcP8kfgaToDSoGpx5/vSkJDMjccHKlW5NdP8k6WRVdULShWPJcPJdcG0fyWPCRWRfyt3ORscxdRwldK8k2mSkenCknW44",
    "fSolk2ZcH8o9WQy",
    "W4xdLmkHWOhdJHpdNYD4W6ldVG",
    "ru98WOf7kbFcKeZcMSosBSon",
    "W4eRW69uW54",
    "nCoSWRdcOs85qZXaWONcSX/cKSkf",
    "i8oQW6NdTaeTyu5YyCoAp8ofWRa",
    "b0zLmZpdQmkWWPpcICoo",
    "W7BdSYPLW4KpWPhdUHhdVLG",
    "mbKcWO1W",
    "bw7dOCobC8k1",
    "BmkxWQddUSoXsSkQWQhdLmo/W6BcUtm/FtVcJmo8iGC1W5CHW5ddU8kqWRKpaCoWWQpdL8ozl1jIxCo0j0jLWPCQW4BcPc4hWPSOW6ZdLL7dTHZcLubdcwz8kSoGr0flvmkUkcldGcjOW6zKWPXTA8knW4bhaSkjWR0",
    "W47cVX8PW5Xdp1VdTW",
    "hmofmM/cHSo9",
    "imkgW6tdISoPsSkRWQy",
    "v8kcxvqtWO88",
    "t8omWPpdLapdVSkQ",
    "sg9OESoNW4pdJsmxW7S1DrhdIW3dHW",
    "imoSWQNcIZu5",
    "m8kpW6hdT8o6tG",
    "W4hdGCk5WOhdJqBdNW",
    "8jk6Gs7cV30YuSkIumoiW59UW40osNm4W5D2",
    "WRNcRKOZwX9o",
    "W57cLtCMW4pcP8k5sbm2",
    "kHhcStZdPa",
    "u8oWW6f7td/cMSk3iSk+m8kVWQ7dMCoBW7ZcUxD/wW",
    "WQFcLCoPk8o3fsq",
    "W5xdNYPYW4O",
    "mCkdW6tdNmoRtSk3WQBcPCkXW7VcONS1Et0",
    "WQvCnxzMDHZdScy",
    "scTBWQP/",
    "fmkHrLVcQHRcSW",
    "pW/cLrRdJG",
    "WRhcOLCKqXy",
    "W7xcS8o+W5KY",
    "g8kGwNVcUthcJ1G5",
    "h149WPKIWRdcQa",
    "nmkoW7pdQCoXsSkG",
    "uCopotNdGmkSW6y",
    "d8kUcG",
    "iCopm2JcL8o7WRVdSmk4Feums8kpwSkUDmkrWOCvdtvWWRjrFCoYk8omb3XwW6i",
    "W6iXWQq",
    "WRbsWPOK",
    "nqWpWOXGWQe",
    "pcdcOZ3dMW",
    "bdNcVIVdR1m0WPRdGq",
    "WRGoa8kEDG",
    "fSkNr27cPXJcOG",
    "WRZcLGJcSSoE",
    "W7vTCvtcUq",
    "xCkisq",
    "W7nrC8o8csFdJe4XdSosbCkbW493nW",
    "d2ldO8osySkV",
    "W7/cLmoCb8ooeda",
    "caRdOmk0aG",
    "W5PNW7ddVs9RWRLNWQ/dS33cPmk/W79CWRpcMmkTWQdcOLVcGYbjzSomWOddJdWIxLBdMmkJrxdcNConiSoOlY0rWQ07WPm0r8kWu8o2W5FdQmolWORdHI3IH53dJbpdUsSDW4D3W5tcI8kFwg8XWPdcM8oSESoqyL7cMSoHW6ddJCkfWQBcISo+gSoFv8k2m8oeWQ3cV8oby3hcIcTxg3BdQv/dKSoQgCkZeSkZk8kFW44",
    "wSogWPxdMbBdUmkV",
    "W5SOWP8Qba",
    "WQ/cMmknWOFcJ8o5hmkHu8kjWRddGSkEW6xdOhm",
    "W6/dKcvNW7i",
    "gCkRqNZcMq",
    "smobWO7dOXy",
    "W4lcOrC9W4PJ",
    "isj7A3m",
    "aeGkChRdTLeeoCkLyCoDE8kwW4xdPcJcMfu",
    "W7fqB8oIfq",
    "sL7cTSo1WR/dJ2fyWQa",
    "W6jaWOCGAGtWM5cFWPxcOq",
    "W4lcQSou",
    "xqH5WP9LW7hcQg/cJdj2nG",
    "W6uOWOaLpq",
    "lti1WOK3",
    "EGPlWOTy",
    "cenR",
    "cSoIWRVdISoR",
    "r8kEA2ud",
    "oSobWPJdPCo/",
    "oCkjW67dVmoVy8knWP/cPq",
    "WR/cH8k9oCo9edNcMeP7WPZdPKFdS8k0",
    "W4hdNmk4W5JdMbpdGN4",
    "ksVdVSkigWtdHdxdNmo7hW",
    "W6OGhCkBA8oIW4zID8oZrhpcSmknbW",
    "wr97WO9ZW6ZcRg/cMZ4",
    "ncddQmkzkIpdVGZdTq",
    "WR5unSoThbxdMLfPsSoibCoEW6P6lWpdSwKgj0PKWPC/au7dQ8ooW4efW4BcRCkce8o1qCkNg8k8mgddGdWkjCoaW7eYrYrFW47dQcvpW6/dU3ZdHComWOyCp8kukY0VWQqJWRr3ndbBlCownN1jWQjsW5O",
    "W7hdPCkGW7tdSa",
    "WQ9EoMbNCIhdJH4",
    "smo7W7XRuGpcR8kEaq",
    "mmoQW6xdHs4NyL95E8oS",
    "W7ldTZv4W6qbWPZdPXVdVGf8ygxdKG",
    "c8oQWR7dOmobWQJcSSkqwG",
    "eSkIfXO",
    "bttcQaddPW",
    "iYSSh8kXWOBcG3D7WRjMivtcMqZdNetdT24IW4ldSmojW4nWg8oxWRdcNeJcIGNdU8oke2ZcVqRdL8oREILJkSkcW6VdRsTNnCopW6KyW40Fi0zcW6FcKa7dSqDbW61+WQJdLSku8kY4I8kUoSk7W43dQCkAWRWJ",
    "oWSwWRSB",
    "jSo6W67dKGW6iuLOEW",
    "nCklDLtcGW",
    "a8o8WQNcQYe",
    "iqfQqua",
    "WR/cVmkevSowxSkSjg5wbmkSyXlcGGTODab2W791WQOHW7rtW5TBfu0xW5VcK3aTo0yjWRxcIuL3CmoziwGTW4GDh27dI8k2wCkaWPFdRVcFN5GfWQxdIYPvW6G",
    "dSoRWQJdTLbu",
    "W6hdRGHFW6C",
    "W70KWQKSdG",
    "umopW6noWOVdLub2WP44W5RdQCosFCkwWOeSrCokWPO",
    "W7BcS8kEqSkI",
    "tb5QWPL+W6RcVG",
    "tSorlSklW4e",
    "WRCSgCkgDmoI",
    "WRxdGSoDW7XX",
    "W6dcTmkmu8kfCCkPnMK",
    "umkdweuiWO02WPzOWOjAWOG",
    "jSo7W7pcNaaNAePWomo/m8oTWQzXBI8",
    "y2u2nI4LWO3dSmoyoNv5W4S",
    "umoWD3hcPqRcRNKbWPK6o8oYlYlcL8kgW6PVW7rmmcfqW7pcMLjjqCkRF8kpWPJcRCoZbmorW65Oi0bjWQG4W4KofSoXm37cMCohdLzYbfe1WOm0qfJdK8kgswqLW7NcSmokzmoRbMzmvSopWRPMF8orWQO4W4C",
    "hJlcOJJdThGfWOddOGJdVSkOWRa",
    "v27cPSoCEeVcIMhcMCk1s3NcR8onsKWAWPNdJmkFvhtcUJxdHmk2kmkAWOhcJdpcVYRdKCo1W6JcRKWcwCkqECo3oc/dIWLuzGRdQCoQW6HQW6JdIJRcOSkNetS5rG",
    "WRJcN8oCimo7aYBcLgf0W4xdT3hdV8kYW4bDW4m",
    "WOxdN8okW4bv",
    "fW0iWOfK",
    "wWL7WR97W6dcOgtcGs9vpmkxW74",
    "W53cVSoqW7Ca",
    "n8ooW4xdMtq",
    "mZjMqMbXW5xdLCo6oxnSW7ZdGmo3W6y",
    "W65bEmoPbbW",
    "WOuKW6ldVJ1lW6yaW6O",
    "WQaUaCkAzW",
    "jr0hWPq",
    "rSktzJ3dHmkQWQJdISk0AbiI",
    "W6XlE8oSaHe",
    "W57cNs1/W4NcPW",
    "F8oFlSkaW5FdLWZcHcDhWR7dPmowW7K",
    "tCoFf8o7pG",
    "uSoWW7n8qYm",
    "W74yWQuSgq",
    "o8kpWOf7",
    "W6ZdUt9ZW7Gf",
    "b8opmv7cGW",
    "y0Pks8oR",
    "ir0AWR15WRFcHSoRamoQFx1rva",
    "h2RdVCkokSoWWP1lW5jqxCo6W7tcH8oger4KWPBcHq",
    "BSoTWQ3cKMm/qJHDWO7dJetcVCkaBSoJWQJcG8kOW7ZdV8oIi3xdLCkBiLRdJCkSB8oTnedcHmoiWPRdMCoZdCoPtSkFpCkfW7xdGmoiCGhcKd7cN8kQWOjpxGRcM8o5sYxcJ8oUWOZdPsHftCkCdMpcIConEmooW6tdRa",
    "fSolk2W",
    "jCo/W63dLamSt0n1ECo8",
    "WQexWQmeW48",
    "xZ3cTSksmSoVWOLRW65tkmo5",
    "p8koWOTXW64DyCktWQuqW60",
    "pcRdOSk5lG7dHdxdTCo8gc3dQSkddX4",
    "WR/dLmkKW6Slvmk5WP09eSol",
    "WRPtn3XM",
    "bmolm3JcKq",
    "v05QWRjKlHZcS2/cGCokF8oAcu5L",
    "rCoWW6f6ssxcLa",
    "fmoSW6/dNb8",
    "d8oAW5ZdUJC",
    "W5pdLmkLW5/dJW",
    "WRpcJw4Wua",
    "kdpcUtRdVgLaWOxdUa7dTa",
    "W6RdNqdcUCkAW4BcLce",
    "W5ZcLtvQ",
    "mH0wWOXwWR3cHCo6c8oWsW",
    "WQ7dGSouW5Dt",
    "hX/cQ8oGWQZdQqSFW4WEjmoTWPPLzmkvaG3cKZZdHXjJWQeLAmksW5pdVSkgWOGoj8kkiSoeW74vW6BdUSkdldiwWQT0xc4wEZr9W40TaYpcG8k0hSo2E0fhzSoMt8kHumkXf1JcMG3dO8k9WQFcUwuUWQOci8khqJ/dOSk5W5pdSCoYWOVcKci6eSktWQJcQCk1qHLlFtdcS0OSW4dIJPJdUa",
    "W7lcJmojWQhcLCo9aCkMiSohWQ3dMCowW6/dPhudW4LpW47dICknvqldKmoNW6rcgmooexFcJZ7dImkYW5pdSspcICo3b8k5rG5rpxzvWQVcU34R",
    "W5v0tdVcMvhdMeGNW4hdUslcH8ovvtqxWR08qq",
    "W47cV8oOW64y",
    "WQNdQmoxW6G",
    "emofWOhcJGy",
    "umkfFM43",
    "WROHcG",
    "hIpcQsldUa",
    "tCoOWRVdLW4",
    "uu96WR99pGdcTa",
    "o8kpWOf1W7b4CmktWRynW7vQW4ldJmoaWOm",
    "yxPi",
    "nSoCWR7dOhu",
    "ruL8WPH+jZVcQvFcH8oVySoAea",
    "W7VcOSobW7SdWQ7dP8k4c39GW4hcKJrOW5fKWQ3cR8kYWOhcS8oFswCRWQpdR3xcGSkehgiCjWRcKWX2p8kQutRcQCofkW85EhabWO85EW7cUCoMW4FcJ0NdIZW",
    "lCokW7ddQYW",
    "u8kgtuSDWOS8WO1LWO8",
    "W4r0twBcUuldKfeOW4FcTsxcH8oDtG",
    "dGDExd7dVeKFWR3cOI/dKMBcM8omW7u7",
    "rfxcRmozWRNdOLG",
    "WQ3cGmoGkSo2bGNcMuX5W5u",
    "B0JcNmoEWOy",
    "8jwgP8obW58xW7JcTmopW5/dJSk0qmkUkSoLW6T6AmooW49mDGhcQrWvW6HutSogdIHxt8omkCoXW70UWRRdVYZcR8k+WRnBbwC0WPFdNW",
    "WQHtl3jNwZW",
    "WRZcMCkeWQ3cJ8o5",
    "WQddOSonW4H+W6hcT2Koymk5uSk8ja",
    "WO5yfunz",
    "jCkqWOr6",
    "W5ZcNtj7W43cOCkZrZmUD33dMa",
    "WQC1WO4rW7i",
    "jXWkWR1JWRFcHCo6iSo3thb9xSkmWPS",
    "WP/dMSkNW5JdGXNdGNnNW63dVCotW7lcVvDSWQhIGAyKeseXWQtdQrVcHmo/qLaGWO3dKwNdMwNcH0VdS8ka4OcNWQddHCkjwmkWqCoAW4mS",
    "WQ9gWPiZFwL1W4pdKmoMWO40t8k7W4Lc",
    "qeTIWOj3",
    "WPFcIrJcGCo9eCkp",
    "W4FcVmkxs8ka",
    "8l+GNConW7RcMKNcQsH8bvJdRxegWPvkB2fmyCoKW6pcQN7cPW",
    "sSorWOtdSbBdUmkhW4lcMSovWRrCWQK",
    "W6nsF8o9h1NdJ0CMbmohdSkCW702kaFcUZy4na",
    "W5fPthi",
    "qfHTvCoP",
    "WRRcKCoIz8k1tZJcNK96WPZdPeVdQCkYW4HDW5aEuW",
    "sCoxbmomoW",
    "W5e/W7beW7O",
    "W5ZcV8oDW7Ow",
    "W73dMrdcR8kcW4lcIZblW4viW4pcRSoA",
    "W6hcRmkddCkgxmkNlhnefmoVAWFcKvrVDf8",
    "WQNcMCkDWOVcJCo5hW",
    "WRiMhSkFBSoSW5e",
    "r8o6W6blqsJcKW",
    "xGvGWO5LW6dcO17cItPHkSkSW7nagmor",
    "pmkiW6C",
    "eCocoM7cN8o9WRy",
    "qmofW6jFWOldK2j9WP0KWOu",
    "W4ldKCkZW6NdNbpdGIDDW6xdOSosW7ldRHa8",
    "WOCQW6ZdVZO",
    "uSoHfa",
    "bmodlgtcLSo0WRC",
    "qZxcPcdcSh4eWR7dUrVdP8oGWQr/va",
    "W5bLvLpcHvxdKKqNW5tcLIJcP8ow",
    "WQi9bmkc",
    "nZjRC19WW4m",
    "vCkgwKejWPWN",
    "t8omWO/dPtxdUmkRW4NcL8om",
    "smo7W7fIvs/cNSkG",
    "oCkgWOn4W7u7yq",
    "eLD/DYK",
    "W6C+WR4LgCk0i1VcTa",
    "WQ3cPL0qqX9fea",
    "x8ocWO3dPaC",
    "u8oSWQVdOvTje2ZdJmkhqSoXs8k0culdRmo6WONdU8k0W6HWW7Syd8oFFa",
    "W57cPX8UW4PUnLFdVmoUWOe",
    "cK5NWOeYkb7cPLdcM8kekCozbL06o8kyp8kvv8oXWPpcR8kdWOuEgmkmW4ZcHti1WPldUCoUaSoSimk6W7ZcUSk4WPxcMCktDbWqrG/dHSkeE2JdIc/cTSo1yJ0Ksmk/W4XjWRlcQ1FIGAtcL8k6W67dHWpdJq",
    "ymoDW6nJuG",
    "W7tdVYfKW6SmWQNdPXhdP1X6FhC",
    "W6pcLcCPW6C",
    "WOJcTNiXWQPaW5/cRLtcReH8EcpdNK7cU8k4hSk8Bwn8WOWGWPhdQCoXeSkplutdMNZcU23cVgu3WRtcUc9mdmoCW58",
    "uSoHW71+CdNcLmkJlmkQF8k4WQJdMmob",
    "wCoynCk3W4/dTXpcKYzb",
    "imkwCuRcMa",
    "W7VcQmokW7LGW6VcTgTEhSoBc8ovymosW6JdMmk7WOurDwRdOSogw0jKDmkHx2nLaSkJW6P4a0qgsSoeW7BdV8k/W74jqSkAW6KLW4zdqWu3WRDgdGmRhhFcQcZcLSoLpmkyoSoDW5ddTmo+m8oRmw0JlmkGfmkHB1NcSmkr",
    "WQ9apNjGwW3dKq8Dtmo3WRG",
    "jJn6C1v7W5xdLCotpNq",
    "WPPOc3js",
    "nIyzWRKCW7lcV8keya",
    "W5BdMZL8W44",
    "WOC4W7pdOtC",
    "aXBcVJ/dQq",
    "hmo+pv/cMq",
    "W64mutm0hMJcNuPqcCk5W6ZcPSkzh8kgkmoBg8kRbmk5fSo2W5uEibhdO8kIaSkkWPBcUNCuv8oLW5eWW5dcKCk/WRmfn8owWOdcOmkwWOldKhH/W7FcVCkiW5SHW7BdUSoZWR0LcNldGrLCW5VdHf5EWPZcTWWRWRVdRNFdOCoyW53dQr/dKCouW4jdzmoPWQ89W5jIwSoQgMqWtftdOmkrcCoJWP9vy2qGW4pdVWPFWPldKmo9cIRdIx1rWRhcNmkgWRayd8kHWP3cVdpdN3LPnCoIW5/cOmoJssTdWQf4pmkbCfBcOmoQzSkXCKRdOSo1iLhcIWuGmgnEjtO8WRNcUv1sW5mbWQJcN03dS8kZvCkc",
    "WONdRCkDW4ax",
    "xmowe8o3i8kD",
    "WQZdSdT9W74sWPdcOWddUuL4FMW",
    "W5ZdHbmJW4NdMHlcKIHqAJ/cPMKwW6izWPhdQJtdMmodqCotWRqSWRP0m8oqn8ku",
    "WQ7dQCoxW6HGW4ZcJKeS",
    "W4OZW7jhW4zEW6ZcJ1H9aWVcT8o4AH/cHmkEBmkzwCo0WQBcV8oTWQOhpmkTz8oMgvZcJeSqpmksWPy",
    "W4NcRSowW78sWQxcQmkV",
    "WROQa8kiDSoL",
    "WQ3cLmo0cSoUbYtcHwL8W4ldPKFdPCkLW5S",
    "t8ocWPFcVa3dR8kRW4NcMSow",
    "W4JcRSoqW5mFWQtcQSk5acThW4VcQZu",
    "pmoMWRm",
    "s8oxWO/cVbhdQSkJW54",
    "WOFdQmkBW5y9",
    "W7FdKWdcHq",
    "l8k+hXCf",
    "xwnPuq",
    "WQrBp3DXua",
    "jrqhWPT+",
    "g8oYWQBdV8ox",
    "vfhcQSo+",
    "k8k1WRiUagVdM8oZBCoTpSoSW6hcL8kpWR3dSdK6crPkW7ldNaTAWPvqtmk4WOpdGCoQou7cTmotuCkQvSkoneFcLwLhW6BcGSkaWR7dUCk7twqSpuFcPYmihwRdImoQpWddI8oPWQ7dHmk7FSoPjmo5pYP4W4BdNhZcQCo+W598bfHao1hcLSooBX7dLmkyxHVcUsX3t8ozWQOZnCkUWProWPTaW6BcMLH9pdiepmoYh8kjWOldQSo8W4JdJYldMSo+WRddG8o8W4f4xCoKWPhdP8kUfSogdSowWQjbWP1hp8kGWR4WW7XSWRmXW6NdOhGpBCkHxG",
    "cmoMWR7dVLLAjw3dK8oouCoGxq",
    "WRpcSZ/cTCo7",
    "pSoOWQBcIZe9qG",
    "m8kiW67dRCo8qSk3WQe",
    "W4NdMqJcJ8knW4tcJZPlW5aQW5/cLmokWR3dL8kKW7tcPSkEWOZcTc7cVSk4a8kExsZdPKZdPL8",
    "bSoPWRldSCoaWOe",
    "4PYSk0rqW6pdH8orpJtdOwzGf8orhCouxSk+DY/dH8oSW4NdNJyyW4xcOSoudSkkf8kYW5GsCCoMaSofW617",
    "W69tq8o8jW",
    "fCkRqfVcPXZcTNaBWOWkFSkukq",
    "lIpdQCktlam",
    "atJcTW",
    "FCojlSkWW5/dMWdcJZ1w",
    "rmoQbH0ql2fPWPldPXVcJCo4kSoEtWibWOhcNSotfbL34PYAEXJdS3yKWQ7dJhaNymo2wmoqW5uKr8kTdmoaBmk6W7DpEX9xW4RdOmkta1FcImkUW4NcKqldQSovcSk8WRPZWOlcTLFcGCoyWO7cN8knbCoGyqnrWOuAmSkKW59xjN8li2xcRrj/nSk6DSk8WO5eWPyRWPzXeW3cMmktuNZcPqaIWPpcSblcRbVdV8oPWRhcUSo/s8oljwBdLmoAW4pcLCknuxS",
    "W4tcNGyOW4C",
    "WOhdSSoVW6zJ",
    "omoKWR7dSKy",
    "WQRdQmoDW6X+WQNcRMuuyCkxrmoynmkkWRW",
    "vWryxa",
    "8kUXU8oKWRCMlLGWtCkyW5eXWRtcK3pcQ8k0W5BcPCogW7JdOJT/W5xcMxr7W5ddRxxdPsitW5ddNSkwW4tdPHhcP0pcLclcKmoP",
    "r8ooW7LpWOBdKW",
    "jsSCWPKBW53cRmkD",
    "WRtcQvCMrsPshaS",
    "W7vtw8o2jG",
    "mCofmM/dMSk4WPhdSmk4FGazw8ksW4JcOW",
    "WRqTkCkjva",
    "W7VcQmokW71ZW6RdPa",
    "WOPxkxP1wIC",
    "WONdUmonamowhCoGzt0zfSoQBaxdIIWMoW0I",
    "FSotnSkXW57dGa",
    "W63cT8kA",
    "W5XVtCopiSkTWOHIiCkYccBdTCkmqxf6xXHOmIjuWQD4r1fDWQivbLFcNhRcKCkYW6BcMxj6lfJcIuFdMtvjW5zUneRdOrzHrgWut3POnCkEWPJcJmklbK1SoSoKx3hcLZudW67cHJmZW4JcUZFcISkJW4vyoJ/cPCo+W5RcKLGpa8osqCoeWP/cUJNdIw3cUCoOW57dIWhdOsOuW4/cI07dKeK5atxdImkmWQqxFmoHvvG5gCkaWRuYW4xcHGBcMCkX",
    "mCoHWQhcHYG5sG",
    "bCkMeWCxdwu5W5u",
    "WPBcGX7cGCoWf8kkgfD4td0UWRe",
    "W4ddMCk+W4/dGq",
    "cSkLfq",
    "vq1UWQT+",
    "saPt",
    "wmoAdCoXn8kuaq",
    "W7Dvwmokkq",
    "nSoCWO7cHI8",
    "nrejWPz0WR4",
    "W6hdKSoP",
    "t2P6umoJW4/dLZGOWR8WybFdJaC",
    "oYuwWQ8",
    "W4VcTGWZW45PmuxdJCoGWORcIsW",
    "hZlcSsRdPa",
    "WR8cfCkDAG",
    "WOidW5NdIYi",
    "W47cJmoGW6yg",
    "nYukWQ4kW47cNCkgAqddLW",
    "nmoSWRBcJsi4qsPXWO7cLaVcUSkpEq",
    "CCo2m8kWW5G",
    "W6ZdNqJcN8kl",
    "WQuGamkk",
    "WR/cQeSNuGX0cXmdWP8",
    "r23dRSoqAmkVWOzqW5Cse8oTW6/cGq",
    "WReQgCkQBSoOW4uNB8oMAN/cNmou",
    "W4v1vNFcMG",
    "fmkzpXKX",
    "WQBcK8kq",
    "WPLMs3RcNuldKaW9W4NcStZcNSoD",
    "WQ7cPeSSwXj+cGSdWRSmrqe",
    "amkzW4hdKWVdSSk2W5WwW5BdSvZcSMn5W7u/FSok",
    "WRpcGHjZW5tdNqNcMwq",
    "pIldP8kpkYFdGZldJq",
    "p8keWP0",
    "aKTYBs7dI8k0WOlcJW",
    "WRpdOSobW7LrW6VcThGfESkp",
    "WQHNWQyxWPveW6pcGa8QvaxdSmk3mrRcMCkbmCk9gSk7W6VcSmkQW69jECoJkCo2fxxcGa",
    "ocSAWPG3",
    "W6O1WQm0aSksga",
    "dM7dU8oRBSkZWPPqW51m",
    "WQRcMCo+k8ordc7cLf0",
    "dSkPcJOE",
    "W6VdHaTpW5G",
    "pcqlWR4oW5dcSSkaAWG",
    "W5tcHmo0WQ5femoAW5v0xSkpx2DqWOOgBCocgCkLt8oWWQeqW5pdPtz2WOZcNuqAz30qieqBm0m0W6/cRgtcKSomha7cHYvpnXK0W4FcJd7dUxtdGCoQW5eYWQxdI1e6B3FcO8oKztxdQ8k3x8kfnqNdL3RcMHlcHmo4W4m4W7FdRGdcKGBdQKv2u8oRW6qCySkPW756W5iSnrtcImoMzxO6dt8rWRXVW7OEW7tcULHYymkKf8k7a8kPcmopvmoAaMzaW55Kc8kuW7O8",
    "gt/cTsa",
    "WRRcOK0gwXTAareyWQ8CAri",
    "xWbUWOLKW4NcPhlcMW",
    "W63dPdT2W68oW5ldVrhdVeL2EG",
    "j8oNWQdcGsu1qdXk",
    "WPhdVa0QW45JydZcSSkPW4tdJ2nSk10Hsmo0zqZdIfddS8ofWOVdOZlcPtxcQ8kc",
    "WQVcLCo+kSoQaYy",
    "fmkRrNFcQH3cTgy",
    "aerNDYVdQa",
    "hbzAu33cUuyAWRhcUdlcJJBdHSoyW7eUWOnBmSorp8kgW7CbwZJdIWmVWRidW7hcPL3dLIVdLCkiWP7dQrCnASoRnSoboYFcTXKAWQTLW7bZWQDUlmonfxldQCoapmkpAmkrEr7cHbZdUCknCSoTkSkkWO7cLwLAbSog8kMgL8kbWPldISk+WQa5pWb3W6SmWRvGW47cMmkZW7BdPq4GlNS/h8kKg8k1WQddJSk1AahcN8kLW5L9smk8iSk5ihFcHmoEjulcOumq",
    "DCoFkCk2W5RdLqq",
    "W5VcPmo3W6ibWQJcQCk7",
    "W7JdKaVcICkf",
    "rv/cQSovWQZdPf0",
    "WOC4W7pdQcbHW4qfW6BcVZK",
    "BSoMWRxdJJtdMmkqW73cTSo3WP8",
    "jSoSWRZcKaaZqc1lWPpcHq",
    "h8ollW",
    "iZJdSd3dUdSqWQldQrxcTCkIWQbQr8ojW5NdUSkMe8kbWQLTzSkGlexcMYvcW4GI",
    "WQpcGSo5kmo9da",
    "WRWAW6xdPXG",
    "qCoyW7vAWPpdHgr+WPqMWPldPmoj",
    "d8kKhbewc1azW7W",
    "qSo6W7X9vdNcJSkWoCkIBa",
    "W5yOW5vdW4CnWQ3dHW",
    "WPLMq2dcHKldLLuMWO3cTZdcNmow",
    "gSoVWR7dKufxfKhdHSolqG",
    "W4hcPaKxW5C",
    "WQu7fmkdzW",
    "A8ooi8kPW54",
    "sMDTtmoIW6RdIIqV",
    "kH0aWP9HWRO",
    "WRRcMCkrWRBcUSoZhmkHESkoWRC",
    "z8oxWRa",
    "ce0chdJcSa5FW7VdOMRcLW",
    "rmoCf8o2",
    "WRtcJSk9WOxcOq",
    "vSkcwMuwWPW+WP1LWP95WOlcGby",
    "W701WQi2aSkFeKhcL8kpBhyv",
    "WOONW63dQG",
    "iWSAWO1XWRVcISoGgSo7",
    "WRJdGCkMW6CevmkvWOyldCokeIyEW4S",
    "lCoHW77dNrGSAvG",
    "iW41WQeQ",
    "dIxcTs/dQx4LWRVdQbFdSmkJWRy",
    "WPFcJWtcOa",
    "WOjFfh9e",
    "W5ZcNtj7W4dcTmkP",
    "b0HHwZZdPmk1",
    "W7fjECoHbbW",
    "hW/dJCkTda",
    "vvhcTmoLWQG",
    "WRuJdmkCCCobW4eXDq",
    "uu96WRj+lH/cOK3cNmo7CSo2aW",
    "W6jIyupcRa",
    "emoEmsdcMCo3WRBdVSk6mayivSkyxSkHFmkm",
    "ntn2qNPXW5BdHmoyjejHW5ddIG",
    "a8o8WQlcNti",
    "fdJdR8kmoq",
    "W6pdGHO",
    "jI8mWO4oW4JcUW",
    "cu53EJJdQq",
    "cLL+WPz8DFcJSBCdW4W",
    "WPKnWO8zW4C",
    "WRG8WOKvW6pdRa",
    "WRaGdSkACq",
    "WQCWWOK",
    "WRhdISk4W6Clvq",
    "b8o0WRBdTmoxWORdTSkqs1NcRKra",
    "iSkpWRzGW648ASkD",
    "n8o7W6tdNqG",
    "aSolo17cGmo5WQddQW",
    "qmkss1idWQO2WPrUWOHpWPtcUW",
    "rWbEE2FdVeG",
    "hmo5WQBcLZS",
    "W4JdN8k6W43dOa",
    "WO/dHxeYWPNcRmkYztCEvW",
    "WRxcQea",
    "W5VdJCkAW6/dSG",
    "iCk6WR4RW7W7uq",
    "4PYXWQRcJ8oLrLqiomoaW5JdNCoGuCkIcHBdRmoYW4BdOCo0W7D6W6eqaCoAy8o1W54vW5pcRCoHW5e",
    "g8k9DwZcUrJcOG",
    "W6RdIrFcGG",
    "W6/dP8k0W4/dOa",
    "cSkaCfRcPG",
    "WR8NjCkKva",
    "l8oNWRNdISod",
    "eGPMWPzJW7FcOIZcMZjYkmkUW7u",
    "smkxs0iu",
    "W6JdIaLgW4ZdKqVcKJrkttldJ3q",
    "W6hdQeOZvHaj",
    "aen3wYVdOSkZWOxcT8ocBqCfwmohoG",
    "uGbAxNldUKa",
    "i8krWQTqW4u",
    "WQJdOCoFW6f7W6RcVW",
    "i8ktW7ldSmoZtmkWWRtcKa",
    "v8o4oZmNe3qb",
    "t8oOW4j3WPy",
    "W741WR4KaSkzgwlcNq",
    "j8oGW7NdLa",
    "agxdOCodDCkvWRTPW7q",
    "W7FdUIz4W6CbWQddUWtdTe1HAW",
    "W43dMSo6W5/dNHNdNJy",
    "W6tcVCkzzCkAwmkTihnrE8o3tbC",
    "W7FcVCkvvmk1uSkUmxHltq",
    "WRuNcmkmACoOW4W",
    "n8kZWRfxW70",
    "WRPsWOmG",
    "qK92WOnrjbZcS0BcHSon",
    "b8kUfJesjMOGW7ZdIWtcKmoWlCovxa",
    "umoUqhFcVXxcVIHxWR0SBSkPlcxdG8kaW7b1WQTKlUkCJU+5V8oVWPuqhbxdVZddGCkgWOFdSWtdKCoUAcnavCoQBCkDwLNcVZm9W5xcHL0fC0rgnCkzDKSCW5NcNKLLE8kIW7pdNJlcPqSJrf7dLSkYjxFdH8o/y8keWQemWP7cMSoxxSkFbmkDESkWWQtcJa",
    "W5hcMI1IW4lcSa",
    "uCoEW6LxWOi",
    "B8oXWPJdHJO",
    "W63dUd54W6qf",
    "W43dTSk6W4/dUG",
    "WQtcMCo0k8o9da",
    "at9yWQ4gW4/cRSkgDGBdKt3dNM4+cmoeWPNdNCkGbmk0j8kmW6FdKCoEW7BcICk5WQq0tvJdHmkRACotWPaWWRb5",
    "omkQWOrbW4y",
    "a8knWOLfW60",
    "cCoIWRS",
    "mtPRzh0",
    "W5RcMc5OW4C",
    "8kEcMtnzkmoMWQ/cLCkAW5K+eafBW4aHWObm",
    "nCoSWRdcPZyUxdXaWONcOqNcQmkiBmkNWQNcGG",
    "hw7dT8osrmkYWOfqW51rba",
    "W5RcMZv/W4pcUa",
    "WPRdNCkcW6Kx",
    "W7rfzmkMxvNdIfGHaCkld8kvW6S3E0hdOJfUmeu+W5S",
    "lCoHW7pdLb8awgzq",
    "W6VdSqb3aKXrkYKaWRuq",
    "WPlcIqtcSmo9g8kjdG",
    "W4NcQSosWRSxWQtcTmkObZfQ",
    "nCkbWPf3W7q",
    "8kUTHIjeExRdNSozW5/cO244W6VdI8oXW6hdGCoCjmkhcZ8zcmoSxMxdGW3cNf5ng8oPW5tdKbFcKmkfgW",
    "van2",
    "W6NcNdmzW4bJkLpdVmo9WQJcGciOBHK",
    "rmopW7ntWOBcJebXWOu+WPBdPG",
    "nJD2zMvXW48",
    "4PQj77QSW4hdLbddR8kTW5ZdN8oCWRqsWQ8MCSkRELNdMmoAr3eAW6GCfCkWg1NcGXeKvvZdHY3dRmk3B8k0",
    "tmoAeCoSj8kDcSkJ",
    "hYlcPc/dRG",
    "4P6MWPxcK8onW54zW59Zy8oPW7ldH8oLW6CukSoWasqJmsNcRSoNWPNcMCo5t1bTWO3dJgNdNq",
    "vGXzr3ldTxmFWRxcVdhdNgBdGG",
    "WR03WOKxW6xdJmoIlvq",
    "mCkfWPfqW70Hyq",
    "fCk+cXGb",
    "W4hcVbK",
    "WRqNW5VdJXK",
    "idnVAgbX",
    "eSkVcGaNlgOGW5xdJam",
    "4OEwwc/cLMhcT8kzW6CbW6W",
    "CmovkmkKW4NdMW7cKMDzWO/dSSoX",
    "fSodlgZcLSo0WRFdUW",
    "WPa4W47dJXq",
    "W7pcLCoI",
    "W6tdTYq8W6GbWPVdQre",
    "r8oWW6bNqs/cLmkGeSkKCmkQWQ4",
    "t3HJWO1/",
    "iCo4WRBcKa",
    "W6GYWPWziW",
    "qfJcVCoZWQBdOLe",
    "jCo7W7ZdN18",
    "fmogWQ7dGx8",
    "u8kgxuu+WPGNWPD4",
    "ELXtACouW7tdSb4uW5W",
    "WOaNW7hdIc9MW68",
    "W4mJW7bsW4CqWQBdJKXJfvy",
    "W4r0w3RcJa",
    "W4mJW6jYW4mbWQ3dLgnJb1hcTCoLEWW",
    "hZlcOYFdP34",
    "nc4CWO8zW5NcSmkDsqBdLIddJw97fa",
    "DSowcCkYW4e",
    "W4VcQSoqW7CaWQtcSW",
    "WR5vlwzH",
    "jtazWPjm",
    "WPlcIGVcT8oVpmkgefW",
    "8kU1KIjjEttdK8oaW49WCM3dRCopWRldSmoyW4SZWOuBpXKiW71cEmodhSkDveTbW6VdLCozgSoxW4vuA8oRWQRdRLxcKSoNW5xdRa",
    "rWbED3/dVeGtWR7cVWpdIL3dKG",
    "WRHwWPqPzq",
    "W4rWtN/cILu",
    "uHmIl2ZcV8kQWRlcMmoPFtK",
    "WQq8WOKwW77dOCoyfh0",
    "WO3dHazpW4tcV8k4Ea",
    "WQ/cMmkn",
    "oSkQwLlcQG",
    "nmoKcM7cGa",
    "pmofF37cKCk4WQldQSkYCKukwCkjxmkSB8oEWOurxND1WQHsomoKk8kcf3HrWQmm",
    "rmofW7noWPq",
    "EN9etmoG",
    "W5eKW7ryW5KiWORdJLTLiKZcTCo8",
    "W5XVtCopiSkTWOHIiCkUtg/cO8kqrNrTdaG5CsvgW6GWrerkW6athuBcNxC",
    "raXzqN/dUfW",
    "eCocpMpcK8o9",
    "W6W/WQiKdSkonhNcLmksDq",
    "W6NdG8koW6BdMW",
    "E8oip8kKW4/dLYtcJsXEWPNdS8oR",
    "umopW71uWPhdHa",
    "smozW7zyAW",
    "WOVdLCoAW65y",
    "dJJcVIVdPxipWRNcOb7dUSk5",
    "WR5hl3jN",
    "imkbWOLHW7K",
    "hmoIWPNdKfC",
    "WONcSCoXdCo7",
    "hSoAWRbyWOVdGfjHW4XSWPNdPCkqD8kdWPqKdmkrWQBdM8kMW7FcRvhdUXBdVSkDmxPZW6tdGGpcKWBcRSo1aCkUA3/dVmo9pConW4NcR20IvSkEBdqgWPJdT3/cTSoojSoWdG",
    "uXaJjMVcSSkzWPlcKSoJuJi",
    "pZLMzNO5W53dGmoap3jXW63dGq",
    "WR4QbmkiASo5",
    "rCo/W4rdWRm",
    "WQVcJ8kDWRFcNCo1e8k7A8kf",
    "sMDLxmo6",
    "vmodW6nsWOxdJuq",
    "W4WxWOyveG",
    "taPn",
    "vXDdE0K",
    "W5VcNcbLW4VcSa",
    "W5ZdMrBcG8kpW4pcIq",
    "nCkbygFcKW",
    "W6pdSJzuW7WfWPhdUJJdUv9HA23dMfa",
    "W4BcUmoLW6qbWQdcVG",
    "W4z1r2tcKgpdMK0SW4pcOd7cNa",
    "qCkgsNmoWPGHWOW",
    "WPxcHX7cPCoVf8kt",
    "W6K1WR8SbmkFfMlcKCksAq",
    "WQhcKSkfWQVcL8o5",
    "WQtdR8oCW655W6hcVG",
    "rvNcTmoKWQJdTq",
    "WQ3dJCk6",
    "gXZdV8kRaa",
    "y8o9W7LmWRa",
    "lI/dPmkDpaq",
    "qmkDBZxdGSkTWPBdVmk/vsKO",
    "iHey",
    "pSkthdiS",
    "WQJdN8oTW4rv",
    "lbChWPy",
    "WQ7cOLGXvby",
    "r8kgxaHxW5qHWPDHWOqwWO3cObddLCo0gwRcICoP",
    "WOJcG0ecBq",
    "xSoChSk0W7q",
    "smoMW5n8uIRcGG",
    "WQTxl1D1sI0",
    "WRaQh8kgy8oPW4CXxSo7rMdcUG",
    "WRJcLCoOo8oBdstcHub7W4u",
    "fmodmwK",
    "t17cVW",
    "W6BcVmkevmk/wCk4",
    "iYnNDw9hW57dJCotm3r3W6VdR8o+W7G",
    "nIyzWRKCW7dcT8kACq",
    "W608WReZgmkWhMxcJa",
    "WR1sWOmIBa",
    "W7JdJa9T",
    "W7xcUCkbvCkt",
    "a3JdOmoi",
    "sJ19WPrM",
    "dSoPWRhdP8oLWOhcSSkerKe",
    "WQVcPLu2uG",
    "W5rSs3xcGG",
    "W6W8WR8Jaa",
    "WRm8WPm3W7VdOCoBbxz3jmoRbmoC",
    "W6RdIrr3W6NdKb4",
    "WQ/cMmo1lmoZbY4",
    "ESo2hCoEeW",
    "buzNFY7dOSkP",
    "x8kiq0iiWPW",
    "cJlcPaVdSx4nWRldOW7dL8k0WOT6",
    "wGnSWO9K",
    "W4uIW7jYW5KbWQ7dHuf+nLZcMCoV",
    "qCkgsuKuWPGWWPfKWOuwWPxcQaq",
    "vbXAvW",
    "W5NdTmkoW4FdMG",
    "W6xcTmkiwa",
    "p8kjW6ZdSmoZtG",
    "W7bbE8oHbHhdOfyXaa",
    "WQVdPSon",
    "tM54ESo9W4pdJJi1W6yeEd3dGq",
    "W44OW6Hq",
    "WPhdVa0QW45JydZcSSkPW4tdJ2nSk10Hsmo0zqZdIfddS8ozWOtcP3VdSYVcGCkcEbS2W7vyssqnWRpdLW05W5tcGCouWQ7dQ8oZWRDrW4ddVJnIumkXWPVcMrRcH8k4DHWDx8opW6jEtcldKSobCSkttCknWRaivCkZWRldMqRdRLeJDNPjr8onW6KwW6r8es5WxbZcMbjQW43dHdtcVokpVE+4Hxy",
    "umkdsMumWPW9WOXhWOjiWO/cRbZdGSoN",
    "dmoNWQVdSSobWOhcRW",
    "aCoEjMhcKq",
    "W4NcQSosWRSCWRpcRSk7cZe",
    "ksFdTSktdrJdNYddI8o8ba",
    "W4ldGmk8W7tdOq",
    "WPxcLviWvG",
    "W6hdPdDWW74fWRRdOHhdVuL7EG",
    "vrvou2FdVemzWQxcPsu",
    "W44IW6HqW4em",
    "WRuPWRawW74",
    "WOCwn8kRCq",
    "W6/cVCkdr8kcvq",
    "v8oWW6b9sCk4WPxdQw3cRh3cUmk0W5BdG8o0WQP4De1vwmoZWPy",
    "WRO2WOOqW6xdOq",
    "WR/cGNqUuG",
    "kmkkWRaBW4FcGqeYW5fRW5FcQSkDm8ocW4bLc8kpW4JcLmk6W7VcPv7dUWhdOmkzlgW9W6BdIW/cJGxcOmoXdCoHyx/dVCk0lmoiW5tdRhnnbCokltruW43cOZ7cUmoskCkGemo3emo5tbyHlbjFomksWPD2kSo2W6PYymknbISQjvpcSeCkW5BcJ8oBWOzUj0tdVSk0W5ve8jgjRmkcW5RcN8k/a3RcI8owWOHkWOT1r8kmWRfrWR05zCk2W5euW4lcPCk6EcaoWO0Rl8ofwJ3cSuH9b8ogk8omWPdcJYNcRHFdJCkaywVdSd1bWOS/A33dQSkpW6RcVfJcUSovWQVdRCovfCoYmSo9A8k8W7pdGZ3cIgZdGudcLH1WhSoFf8oxW5FcGYLFW5vSDa1CxM5xbLHKbW",
    "rmoCW6HhwG",
    "uWHfxwFdSq",
    "W6hcUCkErCkYxmk0kM4",
    "W5eZW79BW5a",
    "WRHAWPKLtvr0W4RdJq",
    "WOm6W7hdOJW",
    "WQJcLCkhWQy",
    "W4fPuwpcIfZdQuGSW5FcPd7cNmog",
    "W6ZdGG4",
    "W5qIW7reW5ZcL8kTWPOp4OcE",
    "W705WRKrgq",
    "mCoMWQVcLICV",
    "bXK6W4yQEKtcLK3cGSomASoT",
    "yt3dTSkDnKVdIs3dMmoMggtcRCkDgaLzW5dcG8ksbc3dUZxdHmkLEmoKW4tcJJpdQ2pcHCk5WQ3cS05Yc8ovoSk+DZpcGr5jzvdcISkRWQy+WQ3dIMRdP8oPvxj8chmfWOtdPYi5WQ3dPSoxk8kTfCkBWPiagLv6b8k/spgfLBHDnuvzW4hcObZcJCkXWP1EW4VcR8kgW7JcQ8kfFCkFlfhcUv06W4dcNmk9WQezW6BdHCorwCk7WQbXWQtcH2xcLmk9d0VcTYumymozbW",
    "wCowWPldUq",
    "ySo6W79SdMVcUmk8i8kUE8k8WQldNLZdSW",
    "iHKAWPK",
    "WQaMhSkgymoKW4qRDCoR",
    "qKdcQmo1WQpdO3z9WOvsya",
    "msmlWQSnW5dcU8kn",
    "msrNzMjXW77dJCotpwv2W60",
    "vr4QlM3cTCkNWQtcMCoEAtG",
    "4Q+sbfhdUXegW41djK3dLb/cH8oV",
    "W4RcTGOFW4nOm1pdVmo9WQBcLGOO",
    "kmoOW4VdQbC",
    "W5zrcSkpWO/cH8ou",
    "WPFcHXZcQ8oUg8kteHrVBZyd",
    "dSoPWQ3dLSotWOFcSW",
    "bmkVwgVcRG",
    "ladcUtNdIG",
    "ueFdTCoMWQJdTuz8WOnqkCk5W589ma",
    "WRC2WPq",
    "WR7cK8kAWRBcTmo5aCkMFSkhWQy",
    "WQqRWOOQW7W",
    "WR/cQSo7gmoD",
    "sanAWOPNW6dcV0lcJIHY",
    "bu5GFZ/dQ8k4WPu",
    "bmk/W67dI8oV",
    "WPlcIqBcQ8oU",
    "W6nuzSoRhHddQKO9aCoc",
    "W4tcMCklsCkz",
    "WR3cJmkiWQW",
    "W6lcIJi3W5G",
    "qSktt1qF",
    "W6BdGXnMW5ldVdlcUHy",
    "WOJdRSkJW7Oh",
    "q29ar8o+",
    "fmolksdcHSo9WQhcSG",
    "r8oWW6f6st3cLa",
    "r8kgqLuFWOO",
    "b8oGWRNdV8oBWORcVG",
    "W6NcT8ketG",
    "pd7dTSkznG/dQsNdKmo5dW",
    "WQ3cKmkaWQhcKG",
    "DSkYqKya",
    "tSkfmh3cGmoXWR3dSCoO",
    "W4O+W4fsW7G",
    "W4zyDw7cMa",
    "vGrgxwe",
    "WQxcNSo+kSoQkH7cVgK",
    "WOlcGX7cJCoOf8kk",
    "mYSoW6ClW5NcRCkDBahdIG",
    "ySoqW5u",
    "sCoweCo0oSkBbCo6W7VcL1q",
    "WOBcUCkOWOy",
  ];
  a0_0x3516 = function () {
    return _0x52dd12;
  };
  return a0_0x3516();
}
async function inicializarApp() {
  const _0x1843eb = a0_0x3891,
    _0x4b0992 = {
      QumOb: "Línea 1",
      xNDDm: "Línea 2",
      sCBks: "Comb. Concepción",
      YLOXX: function (_0x53a220, _0x4d7da9) {
        return _0x53a220 + _0x4d7da9;
      },
      GOTyX: function (_0x35a819, _0x492f1e) {
        return _0x35a819(_0x492f1e);
      },
      iMxrh: "hoy",
      FfDqO: "resultados-container",
      iEmZA: "none",
      wwMxV: function (_0xaec673, _0x4bb356) {
        return _0xaec673 === _0x4bb356;
      },
      nJWsg: function (_0x3b5d5d, _0x305926) {
        return _0x3b5d5d === _0x305926;
      },
      pHulr: function (_0x4673aa, _0x16c90e) {
        return _0x4673aa === _0x16c90e;
      },
      zrTGX: "laboral",
      dCYMd: function (_0x575bd7, _0x5129e7, _0x6995c4, _0x292adc) {
        return _0x575bd7(_0x5129e7, _0x6995c4, _0x292adc);
      },
      atLxk: function (_0x4dd94e, _0x4c97e1) {
        return _0x4dd94e !== _0x4c97e1;
      },
      StHsq: "🔄 No hay ruta directa, buscando combinaciones...",
      WpVsP: function (_0x50a424, _0x12efcf, _0x41d675, _0x296b87) {
        return _0x50a424(_0x12efcf, _0x41d675, _0x296b87);
      },
      BGVUy: function (_0x24e624, _0x57bc53, _0x1983ba, _0x3ac421) {
        return _0x24e624(_0x57bc53, _0x1983ba, _0x3ac421);
      },
      JAFtz: function (_0x51613a, _0x10500e) {
        return _0x51613a + _0x10500e;
      },
      yRmzm: "flex",
      vDMkE: function (
        _0x310879,
        _0x28013f,
        _0x49565e,
        _0x275e50,
        _0x35a9a8,
        _0x85135d,
      ) {
        return _0x310879(_0x28013f, _0x49565e, _0x275e50, _0x35a9a8, _0x85135d);
      },
      vQrnq: function (_0x8ce2fa) {
        return _0x8ce2fa();
      },
      bddYY: "origen-select",
      Itmca: "destino-select",
      JvYJq: "dia-select",
      bEMme: "btn-swap",
      siiQr: "click",
      hcxNz: "change",
      ilrha: "❌ Error crítico al inicializar app:",
      bbDfV: "<p class='no-data'>Error al cargar la aplicación.</p>",
    };
  try {
    await _0x4b0992["vQrnq"](cargarDatos);
    if (!baseDatos) throw new Error("No se pudo cargar la base de datos");
    const _0x3ed8fa = document["getElementById"](_0x4b0992["bddYY"]),
      _0x1cee67 = document["getElementById"](_0x4b0992["Itmca"]),
      _0x5a82c0 = document["getElementById"](_0x4b0992["JvYJq"]),
      _0x56f012 = document["getElementById"]("buscar-btn"),
      _0x3137bb = document["getElementById"](_0x4b0992["bEMme"]),
      _0xa5ba15 = document["getElementById"]("ver-todo");
    function _0x2049ed() {
      const _0x34a6f5 = _0x1843eb,
        _0x3fbc52 = [
          ...estacionesEFE[_0x4b0992["QumOb"]],
          ...estacionesEFE[_0x4b0992["xNDDm"]],
        ],
        _0x2cd436 = _0x3fbc52["filter"](
          (_0x4a61e8, _0x5327a1, _0x4939fb) =>
            _0x4939fb["findIndex"](
              (_0x2649ab) => _0x2649ab["id"] === _0x4a61e8["id"],
            ) === _0x5327a1,
        ),
        _0x689aa9 = _0x2cd436["map"](
          (_0x442d51) =>
            "<option\x20value=\x22" +
            _0x442d51["id"] +
            "\x22>" +
            _0x442d51["nombre"] +
            "</option>",
        )["join"]("");
      ((_0x3ed8fa["innerHTML"] = _0x689aa9),
        (_0x1cee67["innerHTML"] = _0x689aa9),
        (_0x3ed8fa["value"] = "16"),
        (_0x1cee67["value"] = "35"));
    }
    function _0xfa45e4(_0x370a5d, _0x19b97b, _0x6354d7) {
      const _0x5b09b3 = _0x1843eb,
        _0x4abb83 = _0x370a5d + "-" + _0x19b97b,
        _0x53e05d = baseDatos["rutas"][_0x4abb83];
      if (!_0x53e05d) return [];
      return Array["isArray"](_0x53e05d)
        ? _0x53e05d
        : _0x53e05d[_0x6354d7] || [];
    }
    function _0x1f49b5() {
      const _0x183eed = _0x1843eb,
        _0x22cf57 = {
          pVnPy: _0x4b0992["sCBks"],
          aGDpu: function (_0x53795b, _0xb52eb0) {
            const _0x35d64e = a0_0x3891;
            return _0x4b0992["YLOXX"](_0x53795b, _0xb52eb0);
          },
        },
        _0x81beb1 = _0x3ed8fa["value"],
        _0x440221 = _0x1cee67["value"],
        _0x3babda = _0x5a82c0["value"],
        _0x2b01eb = _0xa5ba15["checked"];
      if (_0x81beb1 === _0x440221) {
        _0x4b0992["GOTyX"](alert, "Selecciona estaciones diferentes.");
        return;
      }
      const _0x2d62c5 = new Date(),
        _0x17f899 = getFechaLocal(_0x2d62c5),
        _0x5e9664 = baseDatos["feriados"] || [],
        _0x3f61fe = _0x5e9664["includes"](_0x17f899),
        _0x6b205f = _0x2d62c5["getDay"]();
      if (_0x3babda === _0x4b0992["iMxrh"] && _0x3f61fe) {
        const _0x5ef61b = document["getElementById"](_0x4b0992["FfDqO"]);
        let _0x3010fb = "Feriado";
        if (baseDatos["feriados_info"]) {
          const _0x413453 = baseDatos["feriados_info"]["find"](
            (_0x7f963d) => _0x7f963d["fecha"] === _0x17f899,
          );
          if (_0x413453) _0x3010fb = _0x413453["nombre"];
        }
        (console["log"](
          "🚫 Hoy es feriado (" + _0x3010fb + "): Biotrén no opera",
        ),
          (_0x5ef61b["innerHTML"] =
            '\n                    <div class="mensaje-feriado">\n                        <div class="icono-feriado">🚫</div>\n                        <h3>Biotrén no opera hoy</h3>\n                        <p><strong>Hoy es ' +
            _0x3010fb +
            "</strong></p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>El\x20servicio\x20de\x20Biotrén\x20<strong>no\x20funciona\x20en\x20feriados</strong>.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22sugerencia\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20💡\x20<strong>Sugerencia:</strong>\x20Puedes\x20consultar\x20horarios\x20para\x20otros\x20días\x20usando\x20el\x20selector\x20de\x20arriba.\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20"));
        const _0x5b6d8c = document["querySelector"](".filtro-tiempo");
        _0x5b6d8c["style"]["display"] = _0x4b0992["iEmZA"];
        return;
      }
      let _0x417197;
      if (_0x4b0992["wwMxV"](_0x3babda, _0x4b0992["iMxrh"])) {
        if (_0x4b0992["nJWsg"](_0x6b205f, 0x0)) _0x417197 = "festivo";
        else {
          if (_0x4b0992["pHulr"](_0x6b205f, 0x6)) _0x417197 = "sabado";
          else _0x417197 = _0x4b0992["zrTGX"];
        }
      } else _0x417197 = _0x3babda;
      let _0x62bc9c = _0x4b0992["dCYMd"](
        _0xfa45e4,
        _0x81beb1,
        _0x440221,
        _0x417197,
      );
      if (
        _0x62bc9c["length"] === 0x0 &&
        _0x4b0992["atLxk"](_0x81beb1, "16") &&
        _0x440221 !== "16"
      ) {
        console["log"](_0x4b0992["StHsq"]);
        const _0x15d9f0 = _0x4b0992["WpVsP"](
            _0xfa45e4,
            _0x81beb1,
            "16",
            _0x417197,
          ),
          _0x34305d = _0x4b0992["BGVUy"](_0xfa45e4, "16", _0x440221, _0x417197);
        (_0x15d9f0["forEach"]((_0x11ea69) => {
          const _0x5a9687 = _0x183eed,
            _0x236f0d = _0x34305d["find"](
              (_0x3284b4) => _0x3284b4["s"] > _0x11ea69["ll"],
            );
          _0x236f0d &&
            _0x62bc9c["push"]({
              s: _0x11ea69["s"],
              ll: _0x236f0d["ll"],
              d: _0x22cf57["pVnPy"],
              v: _0x22cf57["aGDpu"](
                parseInt(_0x11ea69["v"]),
                parseInt(_0x236f0d["v"]),
              ),
            });
        }),
          _0x62bc9c["length"] > 0x0 &&
            console["log"](
              "✅\x20Encontradas\x20" + _0x62bc9c["length"] + " combinaciones",
            ));
      }
      const _0x167f37 = _0x4b0992["JAFtz"](
          _0x2d62c5["getHours"]()["toString"]()["padStart"](0x2, "0") + ":",
          _0x2d62c5["getMinutes"]()["toString"]()["padStart"](0x2, "0"),
        ),
        _0x3d97c2 =
          _0x3babda === "hoy" &&
          _0x62bc9c["some"]((_0x53174e) => _0x53174e["s"] < _0x167f37),
        _0x410b5d = document["querySelector"](".filtro-tiempo");
      _0x3babda === "hoy" && _0x3d97c2
        ? ((_0x410b5d["style"]["display"] = _0x4b0992["yRmzm"]),
          (_0x410b5d["style"]["opacity"] = "1"),
          (_0xa5ba15["disabled"] = ![]))
        : ((_0x410b5d["style"]["display"] = _0x4b0992["iEmZA"]),
          (_0xa5ba15["disabled"] = !![]),
          (_0xa5ba15["checked"] = ![]));
      let _0x513bf7 = _0x62bc9c;
      _0x3babda === "hoy" &&
        !_0x2b01eb &&
        (_0x513bf7 = _0x62bc9c["filter"](
          (_0x14e9a9) => _0x14e9a9["s"] >= _0x167f37,
        ));
      const _0x129feb = _0x81beb1 + "-" + _0x440221,
        _0x2ef287 = baseDatos["rutas"][_0x129feb],
        _0xb0e1ca = getPrecioRuta(_0x2ef287);
      _0x4b0992["vDMkE"](
        renderizarHorarios,
        _0x513bf7,
        _0x167f37,
        _0x3babda === "hoy",
        _0xb0e1ca,
        _0x129feb,
      );
    }
    function _0x4e087a() {
      const _0x3ca820 = _0x1843eb,
        _0x5b8cad = document["getElementById"](_0x4b0992["FfDqO"]);
      _0x5b8cad["innerHTML"] =
        "<p class='no-data'>Selecciona tu ruta para ver los próximos trenes.</p>";
      const _0x46ac74 = document["querySelector"](".filtro-tiempo");
      ((_0x46ac74["style"]["display"] = _0x4b0992["iEmZA"]),
        (_0xa5ba15["disabled"] = !![]),
        (_0xa5ba15["checked"] = ![]));
    }
    (_0x56f012["addEventListener"](_0x4b0992["siiQr"], _0x1f49b5),
      _0x3137bb["addEventListener"]("click", () => {
        const _0x3fb411 = _0x1843eb,
          _0x2b32f3 = _0x3ed8fa["value"];
        ((_0x3ed8fa["value"] = _0x1cee67["value"]),
          (_0x1cee67["value"] = _0x2b32f3),
          _0x4e087a());
      }),
      _0x3ed8fa["addEventListener"]("change", _0x4e087a),
      _0x1cee67["addEventListener"](_0x4b0992["hcxNz"], _0x4e087a),
      _0x5a82c0["addEventListener"]("change", _0x4e087a),
      _0xa5ba15["addEventListener"](_0x4b0992["hcxNz"], _0x1f49b5),
      _0x2049ed(),
      inicializarSwitchUsuario(),
      verificarFeriado(),
      mostrarFecha(),
      mostrarUltimaActualizacion(),
      inicializarFavoritos(),
      iniciarMonitoreoConexion());
  } catch (_0x2a2d66) {
    (console["error"](_0x4b0992["ilrha"], _0x2a2d66),
      (document["getElementById"]("resultados-container")["innerHTML"] =
        _0x4b0992["bbDfV"]));
  }
}
function renderizarHorarios(
  _0x280287,
  _0xc00e47,
  _0x286fec,
  _0x37bd98 = null,
  _0x542acf = null,
) {
  const _0x29729c = a0_0x3891,
    _0x2009d0 = {
      fqDDu: function (_0x349079) {
        return _0x349079();
      },
      JRxAE: function (_0x8dbdf6, _0x19d464) {
        return _0x8dbdf6 === _0x19d464;
      },
      vpMBZ: "estudiante",
      HdnLa: function (_0x17bfd1) {
        return _0x17bfd1();
      },
      VJwtb: function (_0x203945, _0x2d1cc3) {
        return _0x203945 + _0x2d1cc3;
      },
      yPVrU: "div",
      UAIfn: "paginacion-nav",
      rEdqc: function (_0xb85e5, _0x489ab8) {
        return _0xb85e5 > _0x489ab8;
      },
      oBQqE: "← Anterior",
      McnFg: "hidden",
      hcfxr: "paginacion-info",
      SMiFH: "Siguiente\x20→",
      KVtwA: "resultados-container",
      GFary: "<p class='no-data'>No hay trenes disponibles para esta ruta.</p>",
    },
    _0x2bf1f2 = document["getElementById"](_0x2009d0["KVtwA"]);
  if (_0x2009d0["JRxAE"](_0x280287["length"], 0x0)) {
    _0x2bf1f2["innerHTML"] = _0x2009d0["GFary"];
    return;
  }
  const _0x25a4f8 = 0x5;
  let _0x58aa83 = 0x0;
  function _0x5aeeb2(_0xcab18a) {
    const _0x520d24 = _0x29729c;
    let _0x535365;
    const _0x2c83d1 = _0x2009d0["fqDDu"](getTipoUsuario),
      _0x1042a4 =
        _0x2009d0["JRxAE"](_0x2c83d1, _0x2009d0["vpMBZ"]) &&
        (!_0x37bd98?.["valor"] || _0x37bd98?.["pendiente"]);
    if (_0x1042a4)
      _0x535365 =
        '<span class="precio-pendiente" title="Precio estudiante pendiente de actualización">🕐 <span class="precio-tag">pendiente</span></span>';
    else {
      const _0x1b1fd6 = _0x37bd98?.["valor"] || _0xcab18a["v"];
      _0x535365 = "<span>💰 $" + _0x1b1fd6 + "</span>";
    }
    return (
      '\n        <div class="tarjeta-tren ' +
      (_0x286fec && _0xcab18a["s"] < _0xc00e47 ? "pasado" : "") +
      '">\n            <div class="hora-principal">\n                <div class="bloque-hora">\n                    <span class="etiqueta">Salida</span>\n                    <span class="valor">' +
      _0xcab18a["s"] +
      "</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22flecha\x22>➔</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22bloque-hora\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22etiqueta\x22>Llegada</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22valor\x22>" +
      _0xcab18a["ll"] +
      '</span>\n                </div>\n            </div>\n            <div class="info-extra">\n                <span>⏱️ ' +
      _0xcab18a["d"] +
      "</span>\x20|\x20" +
      _0x535365 +
      "\n            </div>\n        </div>"
    );
  }
  function _0x305c96() {
    const _0x5abf10 = _0x29729c,
      _0x56e5b8 = _0x58aa83 * _0x25a4f8,
      _0x576027 = _0x2009d0["VJwtb"](_0x56e5b8, _0x25a4f8),
      _0x3aa4db = _0x280287["slice"](_0x56e5b8, _0x576027),
      _0x443e74 = Math["ceil"](_0x280287["length"] / _0x25a4f8);
    _0x2bf1f2["innerHTML"] = _0x3aa4db["map"](_0x5aeeb2)["join"]("");
    const _0x3bedc4 = document["createElement"](_0x2009d0["yPVrU"]);
    _0x3bedc4["className"] = _0x2009d0["UAIfn"];
    if (_0x443e74 <= 0x1) {
      _0x2bf1f2["appendChild"](_0x3bedc4);
      return;
    }
    if (_0x2009d0["rEdqc"](_0x58aa83, 0x0)) {
      const _0x47e868 = document["createElement"]("button");
      ((_0x47e868["className"] = "btn-pagina-anterior"),
        (_0x47e868["textContent"] = _0x2009d0["oBQqE"]),
        _0x47e868["addEventListener"]("click", () => {
          const _0x58629d = _0x5abf10;
          (_0x58aa83--,
            _0x2009d0["HdnLa"](_0x305c96),
            _0x2bf1f2["scrollIntoView"]({ behavior: "smooth" }));
        }),
        _0x3bedc4["appendChild"](_0x47e868));
    } else {
      const _0x33834e = document["createElement"]("span");
      ((_0x33834e["className"] = "btn-pagina-anterior"),
        (_0x33834e["style"]["visibility"] = _0x2009d0["McnFg"]),
        _0x3bedc4["appendChild"](_0x33834e));
    }
    const _0x33d3c4 = document["createElement"]("span");
    ((_0x33d3c4["className"] = _0x2009d0["hcfxr"]),
      (_0x33d3c4["textContent"] = _0x58aa83 + 0x1 + " / " + _0x443e74),
      _0x3bedc4["appendChild"](_0x33d3c4));
    if (_0x576027 < _0x280287["length"]) {
      const _0x12b4b1 = document["createElement"]("button");
      ((_0x12b4b1["className"] = "btn-pagina-siguiente"),
        (_0x12b4b1["textContent"] = _0x2009d0["SMiFH"]),
        _0x12b4b1["addEventListener"]("click", () => {
          const _0x2098fe = _0x5abf10;
          (_0x58aa83++,
            _0x305c96(),
            _0x2bf1f2["scrollIntoView"]({ behavior: "smooth" }));
        }),
        _0x3bedc4["appendChild"](_0x12b4b1));
    } else {
      const _0xee9500 = document["createElement"]("span");
      ((_0xee9500["className"] = "btn-pagina-siguiente"),
        (_0xee9500["style"]["visibility"] = _0x2009d0["McnFg"]),
        _0x3bedc4["appendChild"](_0xee9500));
    }
    _0x2bf1f2["appendChild"](_0x3bedc4);
  }
  _0x305c96();
}
function inicializarSwitchUsuario() {
  const _0x5e99e2 = a0_0x3891,
    _0x388333 = {
      AWiwW: "700",
      JZsLi: "400",
      OMOYH: "var(--azul-efe,\x20#4f8ef7)",
      BLEjE: function (_0x40f5d0, _0x40839f) {
        return _0x40f5d0(_0x40839f);
      },
      TEcFF: "switch-usuario",
      VZPaF: function (_0x2566f5) {
        return _0x2566f5();
      },
      FuVkq: "change",
    },
    _0x3dc60e = document["getElementById"](_0x388333["TEcFF"]);
  if (!_0x3dc60e) return;
  const _0x55ca30 = document["querySelectorAll"](".switch-usuario-opt"),
    [_0x82e697, _0x14eeaa] = _0x55ca30;
  function _0x50645d() {
    const _0x4aa2bf = _0x5e99e2,
      _0x2e0b4f = _0x3dc60e["checked"];
    if (_0x82e697)
      _0x82e697["style"]["fontWeight"] = _0x2e0b4f ? "400" : _0x388333["AWiwW"];
    if (_0x82e697)
      _0x82e697["style"]["color"] = _0x2e0b4f ? "" : "var(--azul-efe, #4f8ef7)";
    if (_0x14eeaa)
      _0x14eeaa["style"]["fontWeight"] = _0x2e0b4f
        ? _0x388333["AWiwW"]
        : _0x388333["JZsLi"];
    if (_0x14eeaa)
      _0x14eeaa["style"]["color"] = _0x2e0b4f ? _0x388333["OMOYH"] : "";
  }
  ((_0x3dc60e["checked"] = _0x388333["VZPaF"](getTipoUsuario) === "estudiante"),
    _0x50645d(),
    _0x3dc60e["addEventListener"](_0x388333["FuVkq"], () => {
      const _0x14d0ce = _0x5e99e2;
      (_0x388333["BLEjE"](
        setTipoUsuario,
        _0x3dc60e["checked"] ? "estudiante" : "general",
      ),
        _0x50645d());
    }));
}
function haversineKm(_0x1a886c, _0x535ff9, _0x1c282a, _0x3c73f9) {
  const _0x1f7f84 = a0_0x3891,
    _0x1704e4 = {
      WIINr: function (_0x565465, _0x2487d9) {
        return _0x565465 * _0x2487d9;
      },
      heHnf: function (_0x25e906, _0xab5803) {
        return _0x25e906 - _0xab5803;
      },
      TMkmD: function (_0x180fe5, _0xaf5c0c) {
        return _0x180fe5 + _0xaf5c0c;
      },
      FNUct: function (_0x6122e9, _0x5874ed) {
        return _0x6122e9 / _0x5874ed;
      },
      ZRfjV: function (_0x128692, _0x32d0e4) {
        return _0x128692 / _0x32d0e4;
      },
      mBRLq: function (_0x16f8d5, _0x6ac3f2) {
        return _0x16f8d5 - _0x6ac3f2;
      },
    },
    _0x4ff2eb = 0x18e3,
    _0x102061 = ((_0x1c282a - _0x1a886c) * Math["PI"]) / 0xb4,
    _0x1e3697 =
      _0x1704e4["WIINr"](_0x1704e4["heHnf"](_0x3c73f9, _0x535ff9), Math["PI"]) /
      0xb4,
    _0x296eac = _0x1704e4["TMkmD"](
      Math["sin"](_0x1704e4["FNUct"](_0x102061, 0x2)) ** 0x2,
      Math["cos"](_0x1704e4["FNUct"](_0x1a886c * Math["PI"], 0xb4)) *
        Math["cos"](_0x1704e4["ZRfjV"](_0x1c282a * Math["PI"], 0xb4)) *
        Math["sin"](_0x1e3697 / 0x2) ** 0x2,
    );
  return (
    _0x4ff2eb *
    0x2 *
    Math["atan2"](
      Math["sqrt"](_0x296eac),
      Math["sqrt"](_0x1704e4["mBRLq"](0x1, _0x296eac)),
    )
  );
}
function ubicarEstacionMasCercana() {
  const _0x12557c = a0_0x3891,
    _0xf91d5a = {
      lnWrC: function (_0x19cc2b, _0x2d2021) {
        return _0x19cc2b != _0x2d2021;
      },
      EAaBc: function (_0x28f68b, _0x26bd32) {
        return _0x28f68b(_0x26bd32);
      },
      kxPeV:
        "No\x20hay\x20coordenadas\x20disponibles\x20en\x20estaciones.json.",
      VktNz: "origen-select",
      nlSwz: "change",
      apWdi: "Permiso\x20de\x20ubicación\x20denegado.",
      WgVIY: "Error\x20de\x20geolocalización.",
      WhIOG: function (_0x29785e, _0x148c44) {
        return _0x29785e(_0x148c44);
      },
      OYLmw: "Tu dispositivo no soporta geolocalización.",
    };
  if (!navigator["geolocation"]) {
    _0xf91d5a["WhIOG"](alert, _0xf91d5a["OYLmw"]);
    return;
  }
  const _0xef90d3 = document["getElementById"]("btn-gps");
  _0xef90d3 &&
    ((_0xef90d3["textContent"] = "⏳"), (_0xef90d3["disabled"] = !![]));
  const _0x349b21 = {
      timeout: 0x1388,
      maximumAge: 0x493e0,
      enableHighAccuracy: ![],
    },
    _0x372ff2 = { timeout: 0x3a98, maximumAge: 0x0, enableHighAccuracy: !![] };
  function _0x4a8ec0(_0x36f3e2) {
    const _0x389974 = _0x12557c,
      { latitude: _0x3dded6, longitude: _0x8d4b39 } = _0x36f3e2["coords"],
      _0x142431 = [];
    for (const _0x5f2955 of Object["values"](estacionesEFE || {})) {
      for (const _0x2b10cc of _0x5f2955) {
        if (
          _0xf91d5a["lnWrC"](_0x2b10cc["lat"], null) &&
          _0x2b10cc["lng"] != null
        )
          _0x142431["push"](_0x2b10cc);
      }
    }
    if (_0x142431["length"] === 0x0) {
      _0xf91d5a["EAaBc"](alert, _0xf91d5a["kxPeV"]);
      _0xef90d3 &&
        ((_0xef90d3["textContent"] = "📍"), (_0xef90d3["disabled"] = ![]));
      return;
    }
    let _0x29288f = null,
      _0x351fc7 = Infinity;
    for (const _0x51340e of _0x142431) {
      const _0x40e930 = haversineKm(
        _0x3dded6,
        _0x8d4b39,
        _0x51340e["lat"],
        _0x51340e["lng"],
      );
      _0x40e930 < _0x351fc7 &&
        ((_0x351fc7 = _0x40e930), (_0x29288f = _0x51340e));
    }
    const _0x1de296 = document["getElementById"](_0xf91d5a["VktNz"]);
    (_0x1de296 &&
      _0x29288f &&
      ((_0x1de296["value"] = _0x29288f["id"]),
      _0x1de296["dispatchEvent"](new Event(_0xf91d5a["nlSwz"]))),
      _0xef90d3 &&
        ((_0xef90d3["textContent"] = "📍"), (_0xef90d3["disabled"] = ![])));
  }
  function _0x1ff622(_0x849699) {
    const _0x510437 = _0x12557c,
      _0x3460b5 = {
        0x1: _0xf91d5a["apWdi"],
        0x2: "No se pudo obtener la ubicación.",
        0x3: "Tiempo de espera agotado. Intenta en un lugar con mejor señal.",
      };
    (_0xf91d5a["EAaBc"](
      alert,
      _0x3460b5[_0x849699["code"]] || _0xf91d5a["WgVIY"],
    ),
      _0xef90d3 &&
        ((_0xef90d3["textContent"] = "📍"), (_0xef90d3["disabled"] = ![])));
  }
  navigator["geolocation"]["getCurrentPosition"](
    _0x4a8ec0,
    () => {
      const _0x51b046 = _0x12557c;
      navigator["geolocation"]["getCurrentPosition"](
        _0x4a8ec0,
        _0x1ff622,
        _0x372ff2,
      );
    },
    _0x349b21,
  );
}
function getPrecioRuta(_0x511f07) {
  const _0x4083df = a0_0x3891,
    _0x15d4e3 = {
      GAfio: function (_0x20d2b8) {
        return _0x20d2b8();
      },
      DRnYr: function (_0x1fc0d1, _0x3b143d) {
        return _0x1fc0d1 === _0x3b143d;
      },
      KeTcY: "estudiante",
    },
    _0x1fb138 = _0x15d4e3["GAfio"](getTipoUsuario),
    _0x59eb01 = _0x511f07?.["precios"];
  if (!_0x59eb01) return { valor: null, pendiente: ![] };
  if (_0x15d4e3["DRnYr"](_0x1fb138, _0x15d4e3["KeTcY"])) {
    if (_0x59eb01["estudiante"])
      return { valor: _0x59eb01["estudiante"], pendiente: ![] };
    return { valor: _0x59eb01["general"], pendiente: !![] };
  }
  return { valor: _0x59eb01["general"] || null, pendiente: ![] };
}
function verificarFeriado() {
  const _0x2e0a58 = a0_0x3891,
    _0x5a8813 = {
      mabRX: "Feriado",
      MThkP: "hidden",
      CQeSr: function (_0x3a34ce, _0x5a932d) {
        return _0x3a34ce(_0x5a932d);
      },
      nVDQB: function (_0x76ddff, _0x24fafe) {
        return _0x76ddff && _0x24fafe;
      },
    },
    _0xb7ea99 = getFechaLocal(),
    _0x3459e9 = document["getElementById"]("aviso-feriado"),
    _0x405a58 = document["getElementById"]("aviso-feriados-semana");
  if (
    baseDatos &&
    baseDatos["feriados"] &&
    baseDatos["feriados"]["includes"](_0xb7ea99)
  ) {
    let _0x1c03bf = _0x5a8813["mabRX"];
    if (baseDatos["feriados_info"]) {
      const _0x715537 = baseDatos["feriados_info"]["find"](
        (_0x3c097f) => _0x3c097f["fecha"] === _0xb7ea99,
      );
      if (_0x715537) _0x1c03bf = _0x715537["nombre"];
    }
    (console["log"](
      "🚫\x20HOY\x20ES\x20FERIADO:\x20" + _0x1c03bf + " - Biotrén no opera",
    ),
      _0x3459e9 &&
        ((_0x3459e9["innerHTML"] =
          "🚫 <strong>HOY ES " +
          _0x1c03bf["toUpperCase"]() +
          "</strong>\x20-\x20Biotrén\x20NO\x20opera\x20en\x20feriados"),
        (_0x3459e9["style"]["display"] = "block"),
        _0x3459e9["classList"]["remove"](_0x5a8813["MThkP"])));
  }
  if (
    baseDatos &&
    baseDatos["feriados_semana"] &&
    baseDatos["feriados_semana"]["length"] > 0x0
  ) {
    const _0x5258c6 = new Date();
    _0x5258c6["setDate"](_0x5258c6["getDate"]() + 0x1);
    const _0x67dfa4 = _0x5a8813["CQeSr"](getFechaLocal, _0x5258c6),
      _0x4dff64 = baseDatos["feriados_semana"]["find"](
        (_0x5570fe) => _0x5570fe["fecha"] === _0x67dfa4,
      );
    _0x5a8813["nVDQB"](_0x4dff64, _0x405a58) &&
      ((_0x405a58["innerHTML"] =
        "\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22background:\x20rgba(255,\x20193,\x207,\x200.15);\x20border-left:\x204px\x20solid\x20#ffc107;\x20padding:\x2012px;\x20border-radius:\x208px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>⚠️\x20Mañana\x20es\x20feriado:</strong>\x20" +
        _0x4dff64["nombre"] +
        "\x20-\x20Biotrén\x20NO\x20operará\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20"),
      _0x405a58["classList"]["remove"]("hidden"),
      (_0x405a58["style"]["display"] = "block"));
  }
}
function mostrarFecha() {
  const _0x4625db = a0_0x3891,
    _0x57c89d = { NmgpZ: "numeric", UbCUE: "es-CL" },
    _0x120a9f = { weekday: "long", day: _0x57c89d["NmgpZ"], month: "long" },
    _0x44fa62 = document["getElementById"]("fecha-actual");
  _0x44fa62 &&
    (_0x44fa62["innerText"] = new Date()["toLocaleDateString"](
      _0x57c89d["UbCUE"],
      _0x120a9f,
    ));
}
function mostrarUltimaActualizacion() {
  const _0x41b330 = a0_0x3891,
    _0x3d6afb = { fjYvg: "footer-ultima-update" };
  if (baseDatos && baseDatos["ultima_update"]) {
    console["log"]("📅 Última actualización: " + baseDatos["ultima_update"]);
    const _0x2b29a1 = baseDatos["ultima_update"]["split"](",")[0x0]["trim"](),
      _0x800b89 = document["getElementById"](_0x3d6afb["fjYvg"]);
    if (_0x800b89) _0x800b89["textContent"] = _0x2b29a1;
    baseDatos["advertencias"] &&
      baseDatos["advertencias"]["length"] > 0x0 &&
      (console["warn"]("⚠️\x20Advertencias:"),
      baseDatos["advertencias"]["forEach"]((_0x21d59b) =>
        console["warn"]("\x20\x20-", _0x21d59b),
      ));
  }
}
"serviceWorker" in navigator &&
  (navigator["serviceWorker"]["addEventListener"]("message", (_0x5b68c3) => {
    const _0x4ccb3c = a0_0x21a539,
      _0x3aaa0b = {
        WFMYE: "❌ Error al recargar datos:",
        LRccJ: function (_0x40a676, _0x2afa8e) {
          return _0x40a676 === _0x2afa8e;
        },
      };
    (_0x5b68c3["data"] &&
      _0x3aaa0b["LRccJ"](_0x5b68c3["data"]["type"], "HORARIOS_UPDATED") &&
      (console["log"]("📲 Service Worker: Nuevos horarios disponibles"),
      cargarDatos()
        ["then"](() => {
          const _0x2ead08 = _0x4ccb3c;
          console["log"]("✅ Datos recargados automáticamente");
        })
        ["catch"]((_0x1f3c4e) => {
          const _0x309de1 = _0x4ccb3c;
          console["error"](_0x3aaa0b["WFMYE"], _0x1f3c4e);
        })),
      _0x5b68c3["data"] &&
        _0x3aaa0b["LRccJ"](_0x5b68c3["data"]["type"], "SW_VERSION") &&
        actualizarIndicadorVersion(_0x5b68c3["data"]["version"]));
  }),
  navigator["serviceWorker"]["ready"]["then"]((_0x35fa9a) => {
    const _0xa457ab = a0_0x21a539;
    _0x35fa9a["active"] &&
      _0x35fa9a["active"]["postMessage"]({ type: "GET_VERSION" });
  }));
function actualizarIndicadorVersion(_0x549c33) {
  const _0x5716ff = a0_0x21a539,
    _0x3ae8c7 = {
      nTbRm: "sw-version-text",
      qXWxq: "biotren-",
      UmlQq: "versión: ",
    },
    _0x55c657 = document["getElementById"](_0x3ae8c7["nTbRm"]);
  if (!_0x55c657) return;
  if (_0x549c33 && _0x549c33["startsWith"](_0x3ae8c7["qXWxq"])) {
    const _0x584fb6 = _0x549c33["replace"]("biotren-", "");
    _0x55c657["textContent"] = _0x3ae8c7["UmlQq"] + _0x584fb6;
  } else _0x55c657["textContent"] = "versión: —";
}
const FAVORITOS_KEY = "biotren_favoritos";
function cargarFavoritos() {
  const _0x33729a = a0_0x21a539;
  try {
    return JSON["parse"](localStorage["getItem"](FAVORITOS_KEY)) || [];
  } catch {
    return [];
  }
}
function guardarFavoritos(_0x8eea3f) {
  localStorage["setItem"](FAVORITOS_KEY, JSON["stringify"](_0x8eea3f));
}
function obtenerNombreEstacion(_0x275114) {
  const _0x2562fb = a0_0x21a539,
    _0x178977 = { rgvuu: "Línea\x201" },
    _0x26a197 = [
      ...estacionesEFE[_0x178977["rgvuu"]],
      ...estacionesEFE["Línea\x202"],
    ],
    _0x55f32a = _0x26a197["find"]((_0x3f3ef9) => _0x3f3ef9["id"] === _0x275114);
  return _0x55f32a ? _0x55f32a["nombre"] : _0x275114;
}
function poblarSelectsFavorito(_0x405dad, _0x1557da) {
  const _0x4ca12f = a0_0x21a539,
    _0x5efe42 = {
      ihHKV: "Línea 1",
      iaaQi: function (_0x22b47e, _0x427115) {
        return _0x22b47e || _0x427115;
      },
    },
    _0x545029 = [
      ...estacionesEFE[_0x5efe42["ihHKV"]],
      ...estacionesEFE["Línea\x202"],
    ]["filter"](
      (_0x302573, _0x312b05, _0xff78d) =>
        _0xff78d["findIndex"](
          (_0x6ac0db) => _0x6ac0db["id"] === _0x302573["id"],
        ) === _0x312b05,
    ),
    _0x55534f = '<option value="">— Selecciona estación —</option>',
    _0x32b001 = _0x545029["map"](
      (_0xa413fb) =>
        '<option value="' +
        _0xa413fb["id"] +
        "\x22>" +
        _0xa413fb["nombre"] +
        "</option>",
    )["join"](""),
    _0x1d85e0 = document["getElementById"]("fav-origen"),
    _0x23a466 = document["getElementById"]("fav-destino");
  ((_0x1d85e0["innerHTML"] = _0x55534f + _0x32b001),
    (_0x23a466["innerHTML"] = _0x55534f + _0x32b001),
    (_0x1d85e0["value"] = _0x405dad || ""),
    (_0x23a466["value"] = _0x5efe42["iaaQi"](_0x1557da, "")));
}
function renderizarFavoritos() {
  const _0x5099b9 = a0_0x21a539,
    _0x23fe3c = {
      HRksa: "div",
      DyVgr: "favorito-card",
      FRyWX: function (_0x4e71fa, _0x4cdfe8) {
        return _0x4e71fa(_0x4cdfe8);
      },
      prmXk: function (_0x224aa2, _0x45877e, _0x136eeb) {
        return _0x224aa2(_0x45877e, _0x136eeb);
      },
      oXTIG: function (_0x34946c, _0x159357) {
        return _0x34946c(_0x159357);
      },
      RoXBW: "click",
      TXnRr: function (_0x2b7659, _0x3b8d4) {
        return _0x2b7659(_0x3b8d4);
      },
      nJaUZ: function (_0x42797f) {
        return _0x42797f();
      },
      nuByf: function (_0x43ba08, _0x5d5e9a) {
        return _0x43ba08 > _0x5d5e9a;
      },
      eIzIz: "block",
      BAKQT: "none",
      sZkWE: ".btn-eliminar-fav",
    },
    _0x30cb9a = _0x23fe3c["nJaUZ"](cargarFavoritos),
    _0x1ae019 = document["getElementById"]("favoritos-lista"),
    _0x6cf1a7 = document["getElementById"]("favoritos-vacio"),
    _0x1ebe89 = document["getElementById"]("fav-badge");
  ((_0x1ebe89["textContent"] = _0x30cb9a["length"]),
    (_0x1ebe89["style"]["display"] = _0x23fe3c["nuByf"](
      _0x30cb9a["length"],
      0x0,
    )
      ? "inline"
      : "none"),
    _0x1ae019["querySelectorAll"](".favorito-card")["forEach"]((_0x55bdf3) =>
      _0x55bdf3["remove"](),
    ));
  if (_0x30cb9a["length"] === 0x0) {
    _0x6cf1a7["style"]["display"] = _0x23fe3c["eIzIz"];
    return;
  }
  ((_0x6cf1a7["style"]["display"] = _0x23fe3c["BAKQT"]),
    _0x30cb9a["forEach"]((_0x2dc10b, _0x3a7fe1) => {
      const _0x362507 = _0x5099b9,
        _0x52c6a2 = document["createElement"](_0x23fe3c["HRksa"]);
      ((_0x52c6a2["className"] = _0x23fe3c["DyVgr"]),
        (_0x52c6a2["dataset"]["idx"] = _0x3a7fe1));
      const _0x49555f = _0x23fe3c["FRyWX"](
          obtenerNombreEstacion,
          _0x2dc10b["origen"],
        ),
        _0x536563 = obtenerNombreEstacion(_0x2dc10b["destino"]);
      ((_0x52c6a2["innerHTML"] =
        '\n            <div class="favorito-trigger">\n                <div class="favorito-info">\n                    <div class="favorito-nombre">' +
        _0x2dc10b["nombre"] +
        '</div>\n                    <div class="favorito-ruta">\n                        ' +
        _0x49555f +
        "<span\x20class=\x22separador-ruta\x22>→</span>" +
        _0x536563 +
        '\n                    </div>\n                </div>\n                <div class="favorito-acciones">\n                    <button class="btn-consultar-fav" data-idx="' +
        _0x3a7fe1 +
        '">Consultar</button>\n                    <button class="btn-editar-fav"   data-idx="' +
        _0x3a7fe1 +
        '" title="Editar ruta">✏️</button>\n                    <button class="btn-eliminar-fav" data-idx="' +
        _0x3a7fe1 +
        '" title="Eliminar ruta">✕</button>\n                </div>\n            </div>\n            <div class="favorito-resultados" id="fav-res-' +
        _0x3a7fe1 +
        "\x22></div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20"),
        _0x1ae019["appendChild"](_0x52c6a2));
    }),
    _0x1ae019["querySelectorAll"](".btn-consultar-fav")["forEach"](
      (_0x35a3e3) => {
        const _0x3e31d1 = _0x5099b9;
        _0x35a3e3["addEventListener"](_0x23fe3c["RoXBW"], (_0x5e8489) => {
          const _0x231441 = _0x3e31d1;
          (_0x5e8489["stopPropagation"](),
            _0x23fe3c["prmXk"](
              consultarFavorito,
              _0x23fe3c["oXTIG"](parseInt, _0x35a3e3["dataset"]["idx"]),
              _0x35a3e3,
            ));
        });
      },
    ),
    _0x1ae019["querySelectorAll"](".btn-editar-fav")["forEach"]((_0x5cea1b) => {
      const _0x5e47c8 = _0x5099b9,
        _0x4a68a1 = {
          abPNM: function (_0x35215b, _0x223380) {
            const _0x7b0828 = a0_0x3891;
            return _0x23fe3c["FRyWX"](_0x35215b, _0x223380);
          },
        };
      _0x5cea1b["addEventListener"](_0x23fe3c["RoXBW"], (_0x5a1ee7) => {
        const _0x57da3d = _0x5e47c8;
        (_0x5a1ee7["stopPropagation"](),
          abrirModalEditar(
            _0x4a68a1["abPNM"](parseInt, _0x5cea1b["dataset"]["idx"]),
          ));
      });
    }),
    _0x1ae019["querySelectorAll"](_0x23fe3c["sZkWE"])["forEach"](
      (_0x105a7d) => {
        const _0x149350 = _0x5099b9;
        _0x105a7d["addEventListener"](_0x23fe3c["RoXBW"], (_0x10e46b) => {
          const _0x27b743 = _0x149350;
          (_0x10e46b["stopPropagation"](),
            _0x23fe3c["FRyWX"](
              eliminarFavorito,
              _0x23fe3c["TXnRr"](parseInt, _0x105a7d["dataset"]["idx"]),
            ));
        });
      },
    ));
}
function eliminarFavorito(_0x3c61fc) {
  const _0x4806c3 = a0_0x21a539,
    _0x212e64 = {
      lgVYz: "¿Eliminar\x20esta\x20ruta\x20favorita?",
      sxvsO: function (_0x70a693, _0x3aa18b) {
        return _0x70a693(_0x3aa18b);
      },
    };
  if (!confirm(_0x212e64["lgVYz"])) return;
  const _0x269a53 = cargarFavoritos();
  (_0x269a53["splice"](_0x3c61fc, 0x1),
    _0x212e64["sxvsO"](guardarFavoritos, _0x269a53),
    renderizarFavoritos());
}
function abrirModalEditar(_0x54d711) {
  const _0x5209c5 = a0_0x21a539,
    _0x546398 = {
      gUTxT: function (_0x4ad88c) {
        return _0x4ad88c();
      },
      Ddzkv: function (_0x4aeccb, _0x14b35c, _0x44d989) {
        return _0x4aeccb(_0x14b35c, _0x44d989);
      },
      Npbsx: "fav-nombre",
      GUlfz: "btn-modal-guardar",
      oijxb: "💾 Guardar cambios",
    },
    _0x2d578a = _0x546398["gUTxT"](cargarFavoritos),
    _0x3e5b72 = _0x2d578a[_0x54d711];
  if (!_0x3e5b72) return;
  (_0x546398["Ddzkv"](
    poblarSelectsFavorito,
    _0x3e5b72["origen"],
    _0x3e5b72["destino"],
  ),
    (document["getElementById"](_0x546398["Npbsx"])["value"] =
      _0x3e5b72["nombre"]));
  const _0x56f95b = document["getElementById"]("modal-favorito");
  ((_0x56f95b["dataset"]["editIdx"] = _0x54d711),
    (_0x56f95b["dataset"]["modo"] = "editar"),
    (document["getElementById"]("modal-titulo-txt")["textContent"] =
      "Editar Ruta"),
    (document["getElementById"](_0x546398["GUlfz"])["textContent"] =
      _0x546398["oijxb"]),
    _0x56f95b["classList"]["add"]("visible"),
    document["getElementById"]("fav-nombre")["focus"]());
}
async function consultarFavorito(_0x1804ee, _0x282fdf) {
  const _0x56e301 = a0_0x21a539,
    _0x78f875 = {
      QJfxM: "Comb. Concepción",
      Qufyq: function (_0x589f72, _0x27dcc1) {
        return _0x589f72(_0x27dcc1);
      },
      pmVyH: function (_0x41753e) {
        return _0x41753e();
      },
      HSSYu: ".favorito-card",
      RXETS: "visible",
      kevbR: ".favorito-resultados.visible",
      ahSGc: "activo",
      uenSw: "festivo",
      UDxAZ: function (_0x19ef71, _0x29c643) {
        return _0x19ef71 === _0x29c643;
      },
      UxOjo: "sabado",
      SXYNz: "laboral",
      jdLxo: function (_0x1cfc79, _0x59d0b7) {
        return _0x1cfc79 + _0x59d0b7;
      },
      zAYkp: function (_0x11301b, _0x3fed0e) {
        return _0x11301b !== _0x3fed0e;
      },
    };
  if (!baseDatos) return;
  const _0x1d4086 = _0x78f875["pmVyH"](cargarFavoritos),
    _0x1201e1 = _0x1d4086[_0x1804ee];
  if (!_0x1201e1) return;
  const _0x1c2504 = document["getElementById"]("fav-res-" + _0x1804ee),
    _0x4475ed = _0x1c2504["closest"](_0x78f875["HSSYu"]);
  if (_0x1c2504["classList"]["contains"](_0x78f875["RXETS"])) {
    (_0x1c2504["classList"]["remove"](_0x78f875["RXETS"]),
      _0x4475ed["classList"]["remove"]("activo"));
    return;
  }
  (document["querySelectorAll"](_0x78f875["kevbR"])["forEach"]((_0x145dc7) => {
    const _0x5e6831 = _0x56e301;
    (_0x145dc7["classList"]["remove"]("visible"),
      _0x145dc7["closest"](".favorito-card")["classList"]["remove"]("activo"));
  }),
    _0x4475ed["classList"]["add"](_0x78f875["ahSGc"]),
    _0x1c2504["classList"]["add"](_0x78f875["RXETS"]),
    (_0x1c2504["innerHTML"] =
      '<div class="fav-loading"><div class="spinner-mini"></div> Consultando…</div>'),
    await new Promise((_0x2633c3) => setTimeout(_0x2633c3, 0x64)));
  const _0x288fea = new Date(),
    _0x36fece = _0x78f875["Qufyq"](getFechaLocal, _0x288fea),
    _0x19e52c = baseDatos["feriados"] || [],
    _0x42cbbf = _0x19e52c["includes"](_0x36fece),
    _0x3847e9 = _0x288fea["getDay"]();
  if (_0x42cbbf) {
    let _0x50e062 = "Feriado";
    if (baseDatos["feriados_info"]) {
      const _0xd831a3 = baseDatos["feriados_info"]["find"](
        (_0xab0a00) => _0xab0a00["fecha"] === _0x36fece,
      );
      if (_0xd831a3) _0x50e062 = _0xd831a3["nombre"];
    }
    _0x1c2504["innerHTML"] =
      '\n            <div class="fav-feriado-aviso">\n                <strong>🚫 Hoy es ' +
      _0x50e062 +
      "</strong>\n                El Biotrén no opera en feriados.\n            </div>\n        ";
    return;
  }
  let _0x48c844;
  if (_0x3847e9 === 0x0) _0x48c844 = _0x78f875["uenSw"];
  else {
    if (_0x78f875["UDxAZ"](_0x3847e9, 0x6)) _0x48c844 = _0x78f875["UxOjo"];
    else _0x48c844 = _0x78f875["SXYNz"];
  }
  const _0x2d1457 = _0x78f875["jdLxo"](
      _0x288fea["getHours"]()["toString"]()["padStart"](0x2, "0") + ":",
      _0x288fea["getMinutes"]()["toString"]()["padStart"](0x2, "0"),
    ),
    _0x2e7ec9 = _0x1201e1["origen"] + "-" + _0x1201e1["destino"],
    _0x1f8825 = baseDatos["rutas"][_0x2e7ec9];
  let _0x3daa23 = [];
  _0x1f8825 &&
    (_0x3daa23 = Array["isArray"](_0x1f8825)
      ? _0x1f8825
      : _0x1f8825[_0x48c844] || []);
  if (
    _0x3daa23["length"] === 0x0 &&
    _0x1201e1["origen"] !== "16" &&
    _0x78f875["zAYkp"](_0x1201e1["destino"], "16")
  ) {
    const _0x13e06c = baseDatos["rutas"][_0x1201e1["origen"] + "-16"],
      _0x3a8482 = baseDatos["rutas"]["16-" + _0x1201e1["destino"]],
      _0x106a7e = _0x13e06c
        ? Array["isArray"](_0x13e06c)
          ? _0x13e06c
          : _0x13e06c[_0x48c844] || []
        : [],
      _0x2135e8 = _0x3a8482
        ? Array["isArray"](_0x3a8482)
          ? _0x3a8482
          : _0x3a8482[_0x48c844] || []
        : [];
    _0x106a7e["forEach"]((_0x525ba9) => {
      const _0x1b35dd = _0x56e301,
        _0x596684 = _0x2135e8["find"](
          (_0x2c12cf) => _0x2c12cf["s"] > _0x525ba9["ll"],
        );
      _0x596684 &&
        _0x3daa23["push"]({
          s: _0x525ba9["s"],
          ll: _0x596684["ll"],
          d: _0x78f875["QJfxM"],
          v:
            _0x78f875["Qufyq"](parseInt, _0x525ba9["v"]) +
            _0x78f875["Qufyq"](parseInt, _0x596684["v"]),
        });
    });
  }
  const _0x1ce45c = _0x3daa23["filter"](
    (_0x31dea5) => _0x31dea5["s"] >= _0x2d1457,
  );
  if (_0x1ce45c["length"] === 0x0 && _0x3daa23["length"] === 0x0) {
    _0x1c2504["innerHTML"] =
      '<div class="fav-no-trenes">No hay trenes disponibles para esta ruta hoy.</div>';
    return;
  }
  if (_0x1ce45c["length"] === 0x0) {
    _0x1c2504["innerHTML"] =
      '<div class="fav-no-trenes">No quedan más trenes por hoy. 🌙</div>';
    return;
  }
  const _0x3992bd = _0x1ce45c,
    _0x11eff3 =
      baseDatos["rutas"][_0x1201e1["origen"] + "-" + _0x1201e1["destino"]],
    _0x2a2a38 = _0x78f875["Qufyq"](getPrecioRuta, _0x11eff3);
  _0x1c2504["innerHTML"] =
    '\n        <div class="fav-trenes">\n            ' +
    _0x3992bd["map"](
      (_0x2bf64f) =>
        '\n                <div class="fav-tren-item">\n                    <div class="fav-hora-bloque">\n                        <span class="fav-hora">' +
        _0x2bf64f["s"] +
        '</span>\n                        <span class="fav-flecha">→</span>\n                        <span class="fav-hora">' +
        _0x2bf64f["ll"] +
        '</span>\n                    </div>\n                    <div class="fav-meta">\n                        <span>⏱ ' +
        _0x2bf64f["d"] +
        "</span>\n                        " +
        (getTipoUsuario() === "estudiante" &&
        (!_0x2a2a38?.["valor"] || _0x2a2a38?.["pendiente"])
          ? '<span class="precio-pendiente" title="Precio estudiante pendiente de actualización">🕐 <span class="precio-tag">pendiente</span></span>'
          : "<span>💰 $" +
            (_0x2a2a38?.["valor"] || _0x2bf64f["v"]) +
            "</span>") +
        "\n                    </div>\n                </div>\n            ",
    )["join"]("") +
    "\n        </div>\n    ";
}
function inicializarFavoritos() {
  const _0xfbc7df = a0_0x21a539,
    _0x3b31a1 = {
      aukXK: "Nueva\x20Ruta\x20Favorita",
      GafYq: "⭐ Guardar ruta",
      nAnqt: "visible",
      uqNDY: function (_0x47f019) {
        return _0x47f019();
      },
      xxMCX: function (_0x15e835) {
        return _0x15e835();
      },
      dKZFl: function (_0x21e423, _0x3c896f) {
        return _0x21e423 === _0x3c896f;
      },
      NmOlP: "0px",
      wHIyH: "fav-destino",
      gdzTn: "var(--rojo-vibrante)",
      divLx: function (_0x4c1e11, _0x1db996, _0x1e8fc0) {
        return _0x4c1e11(_0x1db996, _0x1e8fc0);
      },
      aSTCa: function (_0x44bab8, _0x5b45f9, _0x5cd2c2) {
        return _0x44bab8(_0x5b45f9, _0x5cd2c2);
      },
      YiNGf: "Selecciona estaciones diferentes.",
      BUUqg: function (_0x4a0019, _0x331af1) {
        return _0x4a0019(_0x331af1);
      },
      kjmaJ: function (_0x22c987) {
        return _0x22c987();
      },
      AHqmr: function (_0x4f3361, _0x4cf15c) {
        return _0x4f3361 === _0x4cf15c;
      },
      wriIZ: "smooth",
      Ivipa: "center",
      WjMAZ: function (_0x53725c, _0x26ab80, _0x32a99b) {
        return _0x53725c(_0x26ab80, _0x32a99b);
      },
      GEBJH: "btn-modal-cancelar",
      UDfHZ: "fav-nombre",
      fbLYH: "click",
      rSMmU: "resize",
      cxZNm: "keydown",
      BXsMG: "fav-origen",
    };
  (_0x3b31a1["kjmaJ"](poblarSelectsFavorito), renderizarFavoritos());
  const _0x39a9ac = document["getElementById"]("modal-favorito"),
    _0x4146b6 = document["getElementById"]("btn-nueva-ruta"),
    _0x199873 = document["getElementById"](_0x3b31a1["GEBJH"]),
    _0x22b0d1 = document["getElementById"]("btn-modal-guardar"),
    _0x276533 = document["getElementById"](_0x3b31a1["UDfHZ"]);
  function _0x1b1191() {
    const _0x560486 = _0xfbc7df;
    ((_0x39a9ac["dataset"]["modo"] = "crear"),
      (_0x39a9ac["dataset"]["editIdx"] = ""),
      (document["getElementById"]("modal-titulo-txt")["textContent"] =
        _0x3b31a1["aukXK"]),
      (_0x22b0d1["textContent"] = _0x3b31a1["GafYq"]),
      (_0x276533["value"] = ""),
      poblarSelectsFavorito());
  }
  function _0x3332e3() {
    const _0x3f094b = _0xfbc7df;
    (_0x39a9ac["classList"]["remove"](_0x3b31a1["nAnqt"]),
      _0x3b31a1["uqNDY"](_0x1b1191));
  }
  (_0x4146b6["addEventListener"](_0x3b31a1["fbLYH"], () => {
    const _0x18f648 = _0xfbc7df;
    (_0x3b31a1["xxMCX"](_0x1b1191),
      _0x39a9ac["classList"]["add"](_0x3b31a1["nAnqt"]),
      _0x276533["focus"]());
  }),
    _0x199873["addEventListener"](_0x3b31a1["fbLYH"], _0x3332e3),
    _0x39a9ac["addEventListener"]("click", (_0x3ae4c6) => {
      const _0x245bd3 = _0xfbc7df;
      if (_0x3b31a1["dKZFl"](_0x3ae4c6["target"], _0x39a9ac))
        _0x3b31a1["xxMCX"](_0x3332e3);
    }));
  window["visualViewport"] &&
    window["visualViewport"]["addEventListener"](_0x3b31a1["rSMmU"], () => {
      const _0x1f4936 = _0xfbc7df;
      if (!_0x39a9ac["classList"]["contains"](_0x3b31a1["nAnqt"])) return;
      const _0x176833 = window["visualViewport"]["height"],
        _0x3a28db = window["innerHeight"],
        _0x3d7baa = _0x3a28db - _0x176833;
      _0x39a9ac["style"]["bottom"] =
        _0x3d7baa > 0x32 ? _0x3d7baa + "px" : _0x3b31a1["NmOlP"];
    });
  (_0x22b0d1["addEventListener"]("click", () => {
    const _0x211413 = _0xfbc7df,
      _0x5e5a10 = _0x276533["value"]["trim"](),
      _0x5c23a4 = document["getElementById"]("fav-origen")["value"],
      _0xe75b87 = document["getElementById"](_0x3b31a1["wHIyH"])["value"];
    if (!_0x5e5a10) {
      (_0x276533["focus"](),
        (_0x276533["style"]["borderColor"] = _0x3b31a1["gdzTn"]),
        _0x3b31a1["divLx"](
          setTimeout,
          () => (_0x276533["style"]["borderColor"] = ""),
          0x5dc,
        ));
      return;
    }
    if (!_0x5c23a4) {
      const _0x1fa6af = document["getElementById"]("fav-origen");
      ((_0x1fa6af["style"]["borderColor"] = "var(--rojo-vibrante)"),
        _0x3b31a1["aSTCa"](
          setTimeout,
          () => (_0x1fa6af["style"]["borderColor"] = ""),
          0x5dc,
        ));
      return;
    }
    if (!_0xe75b87) {
      const _0x380e14 = document["getElementById"]("fav-destino");
      ((_0x380e14["style"]["borderColor"] = "var(--rojo-vibrante)"),
        setTimeout(() => (_0x380e14["style"]["borderColor"] = ""), 0x5dc));
      return;
    }
    if (_0x3b31a1["dKZFl"](_0x5c23a4, _0xe75b87)) {
      alert(_0x3b31a1["YiNGf"]);
      return;
    }
    const _0x540fe5 = cargarFavoritos(),
      _0x354c81 = _0x39a9ac["dataset"]["modo"];
    if (_0x354c81 === "editar") {
      const _0x4de91a = _0x3b31a1["BUUqg"](
        parseInt,
        _0x39a9ac["dataset"]["editIdx"],
      );
      _0x540fe5[_0x4de91a] = {
        nombre: _0x5e5a10,
        origen: _0x5c23a4,
        destino: _0xe75b87,
      };
    } else
      _0x540fe5["push"]({
        nombre: _0x5e5a10,
        origen: _0x5c23a4,
        destino: _0xe75b87,
      });
    (guardarFavoritos(_0x540fe5),
      _0x3b31a1["kjmaJ"](renderizarFavoritos),
      _0x3b31a1["uqNDY"](_0x3332e3));
  }),
    _0x276533["addEventListener"](_0x3b31a1["cxZNm"], (_0x3706cc) => {
      const _0x3c9da0 = _0xfbc7df;
      if (_0x3b31a1["AHqmr"](_0x3706cc["key"], "Enter")) _0x22b0d1["click"]();
    }));
  const _0x2913e4 = document["getElementById"](_0x3b31a1["BXsMG"]),
    _0x11c4a9 = document["getElementById"]("fav-destino"),
    _0x40b17b = [_0x276533, _0x2913e4, _0x11c4a9];
  _0x40b17b["forEach"]((_0x54db73) => {
    const _0x51c6ff = _0xfbc7df,
      _0x3e2ebb = {
        NGYsH: _0x3b31a1["wriIZ"],
        BmSBP: _0x3b31a1["Ivipa"],
        sAXhY: function (_0x3e7ed3, _0x45cc23, _0x235ade) {
          const _0x1cdcf0 = _0x51c6ff;
          return _0x3b31a1["WjMAZ"](_0x3e7ed3, _0x45cc23, _0x235ade);
        },
      };
    _0x54db73["addEventListener"]("focus", (_0x3338fe) => {
      const _0x5bfd8f = _0x51c6ff;
      _0x3e2ebb["sAXhY"](
        setTimeout,
        () => {
          const _0x30c9ab = _0x5bfd8f;
          _0x3338fe["target"]["scrollIntoView"]({
            behavior: _0x3e2ebb["NGYsH"],
            block: _0x3e2ebb["BmSBP"],
            inline: "nearest",
          });
        },
        0x190,
      );
    });
  });
}
document["addEventListener"]("DOMContentLoaded", inicializarApp);
