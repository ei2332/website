#include<bits/stdc++.h>
using namespace std;
template<typename T>
struct seg{
    T shoki;
    function<T(T,T)>f;
    vector< T >s;
    int sz;
    
    seg(int n,function<T(T,T)>F,T sh = 0){
        shoki = sh;
        f = F;
        sz = 1;
        while(sz < n)sz*=2;
        s.resize(2*sz,shoki);
    }
    
    seg(vector< T > x,function<T(T,T)>F,T sh = 0):seg(x.size(),F,sh){
        for(int i = 0;i < x.size();i++){
            s[sz-1+i] = x[i];
        }
        for(int i = sz-2;i >= 0;i--){
            s[i] = f(s[2*i+1],s[2*i+2]);
        }
    }
    
    T q(int a,int b,int k,int l,int r){
        if(r <= a||b <= l)return shoki;
        if(a <= l&&r <= b)return s[k];
        return f(q(a,b,2*k+1,l,(l+r)/2),q(a,b,2*k+2,(l+r)/2,r));
    }

    T q(int a,int b){
        return q(a,b,0,0,sz);
    }

    void update(int k,T x){
        k += sz-1;
        s[k] = x;
        while(k > 0){
            k = (k-1)/2;
            s[k] = f(s[2*k+1],s[2*k+2]);
        }
    }

    void debug(){
        cout <<"-----------------\n";
        for(int i = 0,x = 2;i < sz*2-1;i++){
            cout << s[i] <<" ";
            if(x-2 == i){
                x *= 2;
                cout << "\n";
            }
        }
        cout <<"-----------------\n";
    }

    int find(T x,int a = 0){
        if(a > sz-2)return a-sz+1;
        if(s[a*2+1] >= x)return find(x,2*a+1);
        return find(x-s[2*a+1],2*a+2);
    }
};
int main(){
    int n;
    cin >>n;
    vector<int>a(n),p;
    for(int i = 0;i < n;i++){
        cin >>a[i];
        p.push_back(a[i]);
    }
    int q;
    cin >>q;
    vector<pair<pair<int,int>,int>>query(q);
    for(int i = 0;i < q;i++){
        cin >>query[i].first.first>>query[i].first.second;
        if(query[i].first.first == 1){
            cin >>query[i].second;
            p.push_back(query[i].second);
        }else{
            query[i].second = 0;
            p.push_back(query[i].first.second);
        }
    }
    sort(p.begin(),p.end());
    p.erase(unique(p.begin(),p.end()),p.end());
    vector<int>b(p.size());
    for(int i = 0;i < n;i++){
        a[i] = lower_bound(p.begin(),p.end(),a[i])-p.begin();
        b[a[i]]++;
    }
    seg<int> st(b,[](int x,int y){return x+y;},0);
    for(int i = 0;i < q;i++){
        if(query[i].first.first == 1){
            b[a[query[i].first.second-1]]--;
            st.update(a[query[i].first.second-1],b[a[query[i].first.second-1]]);

            b[lower_bound(p.begin(),p.end(),query[i].second)-p.begin()]++;
            st.update(lower_bound(p.begin(),p.end(),query[i].second)-p.begin(),b[lower_bound(p.begin(),p.end(),query[i].second)-p.begin()]);
        }else{
            cout <<p[st.find(query[i].first.second)]<<"\n";
        }
    }
}